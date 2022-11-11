import { default as NounsAuctionHouseABI } from '../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json';
import { ChainId, ContractDeployment, TEMP_ContractName, DeployedContract } from './types';
import { Interface } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

const proxyRegistries: Record<number, string> = {
  [ChainId.Mainnet]: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
  [ChainId.Rinkeby]: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
};
const wethContracts: Record<number, string> = {
  [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.Ropsten]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Rinkeby]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Kovan]: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  [ChainId.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
};

// const NOUNS_ART_NONCE_OFFSET = 4;
const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 9 - 6 //- 4 - 2;
const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 12 - 6 //- 4 - 2;

//re - 6
//- 3 (no descriptorv2)
//- 3 again (not deploying seeder/descriptor/nftdescriptor)

task('deploynew', 'Deploys NFTDescriptor, NounsDescriptor, NounsSeeder, and NounsToken')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addOptionalParam(
    'lilnoundersDAO',
    'The lilnounders DAO contract address',
    '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8',
    types.string,
  )
  .addOptionalParam(
    'nounsDAO',
    'The nounsDAO contract address',
    '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8',
    types.string,
  )
  .addOptionalParam('weth', 'The WETH contract address', undefined, types.string)
  .addOptionalParam(
    'auctionTimeBuffer',
    'The auction time buffer (seconds)',
    1.5 * 60 /* 1.5 minutes */,
    types.int,
  )
  .addOptionalParam(
    'auctionReservePrice',
    'The auction reserve price (wei)',
    1 /* 1 wei */,
    types.int,
  )
  .addOptionalParam(
    'auctionMinIncrementBidPercentage',
    'The auction min increment bid percentage (out of 100)',
    2 /* 2% */,
    types.int,
  )
  .addOptionalParam(
    'auctionDuration',
    'The auction duration (seconds)',
    60 * 60 * 0.25 /* 15 Minutes */,
    types.int,
  )
  .addOptionalParam(
    'timelockDelay',
    'The timelock delay (seconds)',
    60 * 60 * 24 * 2 /* 2 days */,
    types.int,
  )
  .addOptionalParam(
    'votingPeriod',
    'The voting period (blocks)',
    Math.round(1 * 60 * 24 * (60 / 13)) /* 1 Day (13s blocks) */,
    types.int,
  )
  .addOptionalParam(
    'votingDelay',
    'The voting delay (blocks)',
    1 /* 0 days (13s blocks) */,
    types.int,
  )
  .addOptionalParam(
    'proposalThresholdBps',
    'The proposal threshold (basis points)',
    100 /* 1% */,
    types.int,
  )
  .addOptionalParam(
    'quorumVotesBps',
    'Votes required for quorum (basis points)',
    1_000 /* 10% */,
    types.int,
  )
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();
    console.log(`deployer=${deployer}`);
    // prettier-ignore
    const proxyRegistryAddress = proxyRegistries[network.chainId] ?? proxyRegistries[ChainId.Rinkeby];

    if (!args.lilnoundersDAO) {
      console.log(
        `Lil Nounders DAO address not provided. Setting to deployer (${deployer.address})...`,
      );
      args.lilnoundersDAO = deployer.address;
    }
    if (!args.nounsDAO) {
      console.log(`Nouns DAO address not provided. Setting to deployer (${deployer.address})...`);
      args.nounsDAO = deployer.address;
    }
    if (!args.weth) {
      const deployedWETHContract = wethContracts[network.chainId];
      if (!deployedWETHContract) {
        throw new Error(
          `Can not auto-detect WETH contract on chain ${network.name}. Provide it with the --weth arg.`,
        );
      }
      args.weth = deployedWETHContract;
    }

    const nonce = await deployer.getTransactionCount();
    // const expectedNounsArtAddress = ethers.utils.getContractAddress({
    //   from: deployer.address,
    //   nonce: nonce + NOUNS_ART_NONCE_OFFSET,
    // });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const expectedNounsDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const deployment: Record<TEMP_ContractName, DeployedContract> = {} as Record<
      TEMP_ContractName,
      DeployedContract
    >;

    const nounsDAO_seederAddress = '0xF6a38E8235916334268da317EC84F5dfcfB9e023';
    const nounsDAO_descriptorAddress = '0xB6D0AF8C27930E13005Bf447d54be8235724a102';

    const contracts: Record<TEMP_ContractName, ContractDeployment> = {
      //   NFTDescriptorV2: {},
      //   SVGRenderer: {},
      //   NounsDescriptorV2: {
      //     args: [expectedNounsArtAddress, () => deployment.SVGRenderer.address],
      //     libraries: () => ({
      //       NFTDescriptorV2: deployment.NFTDescriptorV2.address,
      //     }),
      //   },
      //   Inflator: {},
      //   NounsArt: {
      //     args: [() => deployment.NounsDescriptorV2.address, () => deployment.Inflator.address],
      //   },
      //   NounsSeeder: {},
      NounsToken: {
        args: [
          args.lilnoundersDAO,
          args.nounsDAO,
          expectedAuctionHouseProxyAddress,
          //   () => deployment.NounsDescriptorV2.address,
          //   () => deployment.NounsSeeder.address,
          nounsDAO_descriptorAddress,
          nounsDAO_seederAddress,
          proxyRegistryAddress,
        ],
      },
      NounsAuctionHouse: {
        waitForConfirmation: true,
      },
      NounsAuctionHouseProxyAdmin: {},
      NounsAuctionHouseProxy: {
        args: [
          () => deployment.NounsAuctionHouse.address,
          () => deployment.NounsAuctionHouseProxyAdmin.address,
          () =>
            new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
              deployment.NounsToken.address,
              args.weth,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
        waitForConfirmation: true,
        validateDeployment: () => {
          const expected = expectedAuctionHouseProxyAddress.toLowerCase();
          const actual = deployment.NounsAuctionHouseProxy.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected auction house proxy address. Expected: ${expected}. Actual: ${actual}.`,
            );
          }
        },
      },
      
      NounsDAOExecutor: {
        args: [expectedNounsDAOProxyAddress, args.timelockDelay],
      },
      NounsDAOLogicV1: {
        waitForConfirmation: true,
      },
      NounsDAOProxy: {
        args: [
          // () => deployment.NounsDAOExecutor.address,
          '0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513',
          // () => deployment.NounsToken.address,
          '0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06',
          args.lilnoundersDAO,
          // () => deployment.NounsDAOExecutor.address,
          '0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513',
          // () => deployment.NounsDAOLogicV1.address,
          '0x63DdFBc1cAfC58a957f391a158c98636d9e225E9',
          args.votingPeriod,
          args.votingDelay,
          args.proposalThresholdBps,
          args.quorumVotesBps,
        ],
        waitForConfirmation: true,
        validateDeployment: () => {
          const expected = expectedNounsDAOProxyAddress.toLowerCase();
          const actual = deployment.NounsDAOProxy.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected Nouns DAO proxy address. Expected: ${expected}. Actual: ${actual}.`,
            );
          }
        },
      },
    };



    for (const [name, contract] of Object.entries(contracts)) {
      let gasPrice = await ethers.provider.getGasPrice();
      if (!args.autoDeploy) {
        const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

        promptjs.start();

        const result = await promptjs.get([
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
      }

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

      if (!args.autoDeploy) {
        const result = await promptjs.get([
          {
            properties: {
              confirm: {
                pattern: /^(DEPLOY|SKIP|EXIT)$/,
                description:
                  'Type "DEPLOY" to confirm, "SKIP" to skip this contract, or "EXIT" to exit.',
              },
            },
          },
        ]);
        if (result.operation === 'SKIP') {
          console.log(`Skipping ${name} deployment...`);
          continue;
        }
        if (result.operation === 'EXIT') {
          console.log('Exiting...');
          return;
        }
      }
      console.log(`Deploying ${name}...`);

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
        {
          gasPrice,
        },
      );

      if (contract.waitForConfirmation) {
        await deployedContract.deployed();
      }

      deployment[name as TEMP_ContractName] = {
        name,
        instance: deployedContract,
        address: deployedContract.address,
        constructorArguments: contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? [],
        libraries: contract?.libraries?.() ?? {},
      };

      contract.validateDeployment?.();

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return deployment;
  });
