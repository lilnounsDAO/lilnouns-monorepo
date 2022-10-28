import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { NounsDescriptor__factory as NounsDescriptorFactory, NounsToken } from '../typechain';
import { deployNounsToken, populateDescriptor } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('NounsToken', () => {
  let nounsToken: NounsToken;
  let deployer: SignerWithAddress;
  let nounsDAO: SignerWithAddress;
  let lilNoundersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, nounsDAO , lilNoundersDAO] = await ethers.getSigners();
    nounsToken = await deployNounsToken(deployer, lilNoundersDAO.address, nounsDAO.address, deployer.address);

    const descriptor = await nounsToken.descriptor();

    await populateDescriptor(NounsDescriptorFactory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a noun to itself and a reward noun to the noundersDAO', async () => {
    const receipt = await (await nounsToken.mint()).wait();

    const [, , , noundersNounCreated, , , , ownersNounCreated,,,,minterNounCreated] = receipt.events || [];

    expect(await nounsToken.ownerOf(0)).to.eq(lilNoundersDAO.address);
    expect(noundersNounCreated?.event).to.eq('NounCreated');
    expect(noundersNounCreated?.args?.tokenId).to.eq(0);
    expect(noundersNounCreated?.args?.seed.length).to.equal(5);

    expect(await nounsToken.ownerOf(1)).to.eq(nounsDAO.address);
    expect(ownersNounCreated?.event).to.eq('NounCreated');
    expect(ownersNounCreated?.args?.tokenId).to.eq(1);
    expect(ownersNounCreated?.args?.seed.length).to.equal(5);

    expect(await nounsToken.ownerOf(2)).to.eq(deployer.address);
    expect(minterNounCreated?.event).to.eq('NounCreated');
    expect(minterNounCreated?.args?.tokenId).to.eq(2);
    expect(minterNounCreated?.args?.seed.length).to.equal(5);

    noundersNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    minterNounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await nounsToken.symbol()).to.eq('LILNOUN');
  });

  it('should set name', async () => {
    expect(await nounsToken.name()).to.eq('LilNoun');
  });

  it('should allow minter to mint a noun to itself', async () => {
    await (await nounsToken.mint()).wait();

    const receipt = await (await nounsToken.mint()).wait();
    const nounCreated = receipt.events?.[3];

    expect(await nounsToken.ownerOf(2)).to.eq(deployer.address);
    expect(nounCreated?.event).to.eq('NounCreated');
    expect(nounCreated?.args?.tokenId).to.eq(3);
    expect(nounCreated?.args?.seed.length).to.equal(5);

    nounCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should emit three transfer logs on initial mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();


    await (await nounsToken.setMinter(minter.address)).wait();
    await (await nounsToken.transferOwnership(creator.address)).wait();

    const tx = nounsToken.connect(minter).mint();

    const receipt = await (await nounsToken.connect(minter).mint()).wait();
    const nounCreated = receipt.events?.[3];
    expect(nounCreated?.event).to.eq('NounCreated');

    await expect(tx).to.emit(nounsToken, 'Transfer').withArgs(creator.address, lilNoundersDAO.address, 0);

    await expect(tx).to.emit(nounsToken, 'Transfer').withArgs(creator.address, nounsDAO.address, 1);
  });

  it('should allow minter to burn a noun', async () => {
    await (await nounsToken.mint()).wait();

    const tx = nounsToken.burn(0);
    await expect(tx).to.emit(nounsToken, 'NounBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsNounErc721Account = nounsToken.connect(nounsDAO);
    await expect(account0AsNounErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await nounsToken.contractURI()).to.eq(
        'ipfs://QmNPz2kfXLJwYo1AFQnmu6EjeXraz2iExvCSbENqwr5aFy',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await nounsToken.setContractURIHash('ABC123');
      expect(await nounsToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(nounsToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
