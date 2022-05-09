import { default as NounsAuctionHouseABI } from '../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json';
import { Interface } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

type ContractName =
  // | 'NFTDescriptor'
  // | 'NounsDescriptor'
  // | 'NounsSeeder'
  | 'NounsToken'
  | 'NounsAuctionHouse'
  | 'NounsAuctionHouseProxyAdmin'
  | 'NounsAuctionHouseProxy'
  | 'NounsDAOExecutor'
  | 'NounsDAOLogicV1'
  | 'NounsDAOProxy';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  address?: string;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy', 'Deploys NFTDescriptor, NounsDescriptor, NounsSeeder, and NounsToken')
  .addOptionalParam('lilnoundersDAO', 'The lilnounders DAO contract address', "0x3cf6a7f06015aCad49F76044d3c63D7fE477D945", types.string)
  .addOptionalParam('nounsDAO', 'The nounsDAO contract address', "0x0BC3807Ec262cB779b38D65b38158acC3bfedE10", types.string)
  .addOptionalParam('weth', 'The WETH contract address', "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", types.string)

  .addOptionalParam('auctionTimeBuffer', 'The auction time buffer (seconds)', 1.5 * 60, types.int) //Default ever 24 hrs Revised: every 15 minutes
  .addOptionalParam('auctionReservePrice', 'The auction reserve price (wei)', 1, types.int)
  .addOptionalParam('auctionMinIncrementBidPercentage', 'The auction min increment bid percentage (out of 100)', 5, types.int,)
  .addOptionalParam('auctionDuration', 'The auction duration (seconds)', 60 * 60 * 0.25, types.int) // Default: 1 day Revised: 15 minutes

  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)', 60 * 60 * 24 * 2, types.int) // Default: 2 days

  //  .addOptionalParam('votingPeriod', 'The voting period (blocks)', 4 * 60 * 24 * 3, types.int) // Default: 3 days
  .addOptionalParam('votingPeriod', 'The voting period (blocks)', 33230, types.int) // Default: 3 days Revised 5 days
  .addOptionalParam('votingDelay', 'The voting delay (blocks)', 26585, types.int) // Default: (2 days) Revised: 4 days 26585 blocks
  .addOptionalParam('proposalThresholdBps', 'The proposal threshold (basis points)', 100, types.int) // Default: 5% Revised 1%
  .addOptionalParam('quorumVotesBps', 'Votes required for quorum (basis points)', 1_000, types.int) // Default: 10%
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const proxyRegistryAddress =
      network.chainId === 1
        ? '0xa5409ec958c83c3f309868babaca7c86dcb077c1'
        : '0xf57b2c51ded3a29e6891aba85459d600256cf317';

    const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 3  //6 - 3;
    const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 6 //9 - 3;

    const [deployer] = await ethers.getSigners();
    const nonce = await deployer.getTransactionCount();

    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });

    const expectedNounsDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });

    console.log(`expectedAuctionHouseProxyAddress = ${expectedAuctionHouseProxyAddress}`)
    console.log(`expectedNounsDAOProxyAddress = ${expectedNounsDAOProxyAddress}`)

    
    const NounsDescriptorAddress = '0x11fb55d9580CdBfB83DE3510fF5Ba74309800Ad1'
    const NounsSeederAddress = '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'

    const contracts: Record<ContractName, Contract> = {
      // NFTDescriptor: {},
      // NounsDescriptor: {
      //   libraries: () => ({
      //     NFTDescriptor: contracts['NFTDescriptor'].address as string,
      //   }),
      // },
      // NounsSeeder: {},
      NounsToken: {
        args: [
          args.lilnoundersDAO,
          args.nounsDAO,
          expectedAuctionHouseProxyAddress,
          NounsDescriptorAddress, // () => contracts['NounsDescriptor'].address,
          NounsSeederAddress, // () => contracts['NounsSeeder'].address,
          proxyRegistryAddress,
        ],
      },
      NounsAuctionHouse: {
        waitForConfirmation: true,
      },
      NounsAuctionHouseProxyAdmin: {},
      NounsAuctionHouseProxy: {
        args: [
          () => contracts['NounsAuctionHouse'].address,
          () => contracts['NounsAuctionHouseProxyAdmin'].address,
          () =>
            new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
              contracts['NounsToken'].address,
              args.weth,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
      },
      NounsDAOExecutor: {
        args: [expectedNounsDAOProxyAddress, args.timelockDelay],
      },
      NounsDAOLogicV1: {
        waitForConfirmation: true,
      },
      NounsDAOProxy: {
        args: [
          () => contracts['NounsDAOExecutor'].address,
          () => contracts['NounsToken'].address,
          args.lilnoundersDAO,
          () => contracts['NounsDAOExecutor'].address,
          () => contracts['NounsDAOLogicV1'].address,
          args.votingPeriod,
          args.votingDelay,
          args.proposalThresholdBps,
          args.quorumVotesBps,
        ],
      },
    };

    let gasPrice = await ethers.provider.getGasPrice();
    const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

    promptjs.start();

    let result = await promptjs.get([
      {
        properties: {
          gasPrice: {
            type: 'integer',
            required: true,
            description: 'Enter a gas price (gwei)',
            default: gasInGwei,
          },
        },
      },
    ]);

    gasPrice = ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');

    for (const [name, contract] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      });

      const deploymentGas = await factory.signer.estimateGas(
        factory.getDeployTransaction(
          ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
          {
            gasPrice,
          },
        ),
      );
      const deploymentCost = deploymentGas.mul(gasPrice);

      console.log(
        `Estimated cost to deploy ${name}: ${ethers.utils.formatUnits(
          deploymentCost,
          'ether',
        )} ETH`,
      );

      result = await promptjs.get([
        {
          properties: {
            confirm: {
              type: 'string',
              description: 'Type "DEPLOY" to confirm:',
            },
          },
        },
      ]);

      if (result.confirm != 'DEPLOY') {
        console.log('Exiting');
        return;
      }

      console.log('Deploying...');

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
        {
          gasPrice,
        },
      );

      if (contract.waitForConfirmation) {
        await deployedContract.deployed();
      }

      contracts[name as ContractName].address = deployedContract.address;

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return contracts;
  });
