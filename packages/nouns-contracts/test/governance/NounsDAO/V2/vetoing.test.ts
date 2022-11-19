import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat;

import { BigNumber as EthersBN } from 'ethers';

import {
  getSigners,
  TestSigners,
  setTotalSupply,
  propStateToString,
  deployGovV2AndToken,
} from '../../../utils';

import {
  mineBlock,
  address,
  encodeParameters,
  advanceBlocks,
  setNextBlockTimestamp,
} from '../../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NounsToken,
  NounsDescriptorV2__factory as NounsDescriptorV2Factory,
  NounsDAOExecutor,
  NounsDAOExecutor__factory as NounsDaoExecutorFactory,
  NounsDAOLogicV2,
} from '../../../../typechain';
import { MAX_QUORUM_VOTES_BPS } from '../../../constants';

chai.use(solidity);
const { expect } = chai;

async function expectState(proposalId: number | EthersBN, expectedState: string) {
  const actualState = propStateToString(await gov.state(proposalId));
  expect(actualState).to.equal(expectedState);
}

async function reset(): Promise<void> {
  if (snapshotId) {
    await ethers.provider.send('evm_revert', [snapshotId]);
    snapshotId = await ethers.provider.send('evm_snapshot', []);
    return;
  }

  vetoer = deployer;

  ({ token, gov, timelock } = await deployGovV2AndToken(
    deployer,
    timelockDelay,
    proposalThresholdBPS,
    {
      minQuorumVotesBPS: quorumVotesBPS,
      maxQuorumVotesBPS: MAX_QUORUM_VOTES_BPS,
      quorumCoefficient: 0,
    },
    vetoer.address,
  ));

  snapshotId = await ethers.provider.send('evm_snapshot', []);
}

async function propose(proposer: SignerWithAddress, mint = true) {
  if (mint) {
    await setTotalSupply(token, 1);
    if (proposer.address !== deployer.address) {
      await token.transferFrom(deployer.address, proposer.address, 0);
    }
  }
  await mineBlock();
  targets = [account0.address];
  values = ['0'];
  signatures = ['getBalanceOf(address)'];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  proposalId = await gov.latestProposalIds(proposer.address);
}

let snapshotId: number;

let token: NounsToken;
let deployer: SignerWithAddress;
let vetoer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: NounsDAOLogicV2;
let timelock: NounsDAOExecutor;
const timelockDelay = 172800; // 2 days

const proposalThresholdBPS = 500; // 5%
const quorumVotesBPS = 1000; // 10%

let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;

describe('NounsDAOV2#vetoing', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;

    targets = [account0.address];
    values = ['0'];
    signatures = ['getBalanceOf(address)'];
    callDatas = [encodeParameters(['address'], [account0.address])];

    await reset();
  });

  it('sets parameters correctly', async () => {
    expect(await gov.vetoer()).to.equal(vetoer.address);
  });

  it('only vetoer can veto [ @skip-on-coverage ]', async () => {
    await propose(account0);
    await expect(gov.connect(account0).veto(proposalId)).revertedWith('VetoerOnly()');
  });

  it('burns veto power correctly [ @skip-on-coverage ]', async () => {
    // vetoer is still set
    expect(await gov.vetoer()).to.equal(vetoer.address);
    await expect(gov.connect(account0)._burnVetoPower()).revertedWith(
      'NounsDAO::_burnVetoPower: vetoer only',
    );
    // burn
    await gov.connect(vetoer)._burnVetoPower();
    expect(await gov.vetoer()).to.equal(address(0));
    await expect(gov.connect(vetoer).veto(proposalId)).revertedWith('VetoerBurned()');
  });

  describe('vetoing works correctly for proposal state', async () => {
    before(reset);

    beforeEach(async () => {
      snapshotId = await ethers.provider.send('evm_snapshot', []);
    });

    afterEach(async () => {
      await ethers.provider.send('evm_revert', [snapshotId]);
    });

    it('Pending', async () => {
      await propose(account0);
      await expectState(proposalId, 'Pending');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Active', async () => {
      await propose(account0);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Canceled', async () => {
      await propose(account0);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      await gov.connect(account0).cancel(proposalId);
      await expectState(proposalId, 'Canceled');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Defeated', async () => {
      await setTotalSupply(token, 3);
      await token.transferFrom(deployer.address, account0.address, 0);
      await token.transferFrom(deployer.address, account1.address, 1);
      await token.transferFrom(deployer.address, account1.address, 2);
      await propose(account0, false);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      // account0 with 1 vote casts for vote
      await gov.connect(account0).castVote(proposalId, 1);
      // account1 with 2 votes casts against vote
      await gov.connect(account1).castVote(proposalId, 0);
      await advanceBlocks(5780);
      await expectState(proposalId, 'Defeated');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Succeeded', async () => {
      await setTotalSupply(token, 3);
      await token.transferFrom(deployer.address, account0.address, 0);
      await token.transferFrom(deployer.address, account1.address, 1);
      await token.transferFrom(deployer.address, account1.address, 2);
      await propose(account0, false);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      // account0 with 1 vote casts against vote
      await gov.connect(account0).castVote(proposalId, 0);
      // account1 with 2 votes casts for vote
      await gov.connect(account1).castVote(proposalId, 1);
      await advanceBlocks(5780);
      await expectState(proposalId, 'Succeeded');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Queued', async () => {
      await propose(account0);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      await gov.connect(account0).castVote(proposalId, 1);
      await advanceBlocks(5780);
      await gov.queue(proposalId);
      await expectState(proposalId, 'Queued');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Expired', async () => {
      await propose(account0);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      await gov.connect(account0).castVote(proposalId, 1);
      await advanceBlocks(5780);
      await gov.queue(proposalId);
      const proposal = await gov.proposals(proposalId);
      await setNextBlockTimestamp(
        proposal.eta.toNumber() + (await timelock.GRACE_PERIOD()).toNumber() + 1,
      );
      await expectState(proposalId, 'Expired');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
    it('Executed [ @skip-on-coverage ]', async () => {
      await propose(account0);
      await mineBlock();
      await mineBlock();
      await expectState(proposalId, 'Active');
      await gov.connect(account0).castVote(proposalId, 1);
      await advanceBlocks(5780);
      await gov.queue(proposalId);
      const proposal = await gov.proposals(proposalId);
      await setNextBlockTimestamp(proposal.eta.toNumber() + 1);
      await gov.execute(proposalId);
      await expectState(proposalId, 'Executed');
      await expect(gov.veto(proposalId)).revertedWith('CantVetoExecutedProposal()');
    });
    it('Vetoed', async () => {
      await propose(account0);
      await expectState(proposalId, 'Pending');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
      await gov.veto(proposalId);
      await expectState(proposalId, 'Vetoed');
    });
  });
});
