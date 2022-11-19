import { Interface } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { default as NounsAuctionHouseABI } from '../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json';

type ContractName =
  // | 'NFTDescriptor'
  // | 'NounsDescriptor'
  // | 'NounsSeeder'
   'NounsToken'
  | 'NounsAuctionHouse'
  | 'NounsAuctionHouseProxyAdmin'
  | 'NounsAuctionHouseProxy'
  | 'NounsDAOExecutor'
  | 'NounsDAOLogicV1'
  | 'NounsDAOProxy';


  const bytes = new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
    "0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06", // nouns token
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // weth (mainnet)
    "90", // auctionTimeBuffer,
    "1", // auctionReservePrice,
    "2", // auctionMinIncrementBidPercentage,
    "900", // auctionDuration,
   ])
  

interface VerifyArgs {
  address: string;
  constructorArguments?: (string | number)[];
  libraries?: Record<string, string>;
}


const expectedAuctionHouseProxyAddress = '0x2E10335d2EE34715453936399301B42D2ea8c55c'
const expectedNounsDAOProxyAddress = '0x4F49457D0Ddd610B451686AeB17dE9562094cD00'

const contracts: Record<ContractName, VerifyArgs> = {
  // NFTDescriptor: {
  //   address: '0x1A1251F943E3C3Fd09a0aafEfDa4e3309032779c',
  // },
  // NounsDescriptor: {
  //   address: '0x43D17060Bd13a1DBb18aE54958C13eEccbf2017B',
  //   libraries: {
  //     NFTDescriptor: '0x1A1251F943E3C3Fd09a0aafEfDa4e3309032779c',
  //   },
  // },
  // NounsSeeder: {
  //   address: '0x4451D889B6B8c9b0f11E3C9C2d5d27ddF4057a00',
  // },

  NounsToken: {
    address: '0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06',
    constructorArguments: [
      '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8', // lilnounders dao multisig
      '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8', // nouns dao treasury
      '0x2E10335d2EE34715453936399301B42D2ea8c55c', // nounsAuctionHouseProxy //expectedAuctionHouseProxyAddress = '0x55790b9183638981cEfbD5627C5C47C1f0f2Af29'
      '0xB6D0AF8C27930E13005Bf447d54be8235724a102', // nounsDescriptor
      '0xF6a38E8235916334268da317EC84F5dfcfB9e023', // nounsSeeder
      '0xf57b2c51ded3a29e6891aba85459d600256cf317', // mainnet opensea registry
    ],
  },
  NounsAuctionHouse: {
    address: '0xe6A9B92c074520de8912EaA4591db1966E2e2B92',
  },

  //*this one
  NounsAuctionHouseProxyAdmin: {
    address: '0x4bEfF263853C4e30d02505A19Cd34F7c9cDFC6BB',
  },

  NounsAuctionHouseProxy: {
    address: '0x2E10335d2EE34715453936399301B42D2ea8c55c', //expectedAuctionHouseProxyAddress = '0x55790b9183638981cEfbD5627C5C47C1f0f2Af29'
    constructorArguments: [
      '0xe6A9B92c074520de8912EaA4591db1966E2e2B92', // NounAuctionHouse
      '0x4bEfF263853C4e30d02505A19Cd34F7c9cDFC6BB', // nounsAuctionHouseProxyAdmin
      bytes,
    ],
  },


  NounsDAOExecutor: {
    address: '0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513',
    constructorArguments: ['0x4F49457D0Ddd610B451686AeB17dE9562094cD00', 172800], // nounsDAOProxy, timelock-delay
  },
  NounsDAOLogicV1: {
    address: '0x63DdFBc1cAfC58a957f391a158c98636d9e225E9', // nounsDAOLogicV1
  },
  NounsDAOProxy: {
    address: '0x4F49457D0Ddd610B451686AeB17dE9562094cD00', // nounsDAOProxy
    constructorArguments: [
      '0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513', // nounsDaoExecutor
      '0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06', // nounsToken
      '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8', // lilnounders dao multisig
      '0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513', // nounsDaoExecutor
      '0x63DdFBc1cAfC58a957f391a158c98636d9e225E9', // nounsDAOLogicV1
      33230, // voting-period 
      26585, // voting-delay
      100, // proposal-threshold-bps
      1_000, // quorum-votes-bps
    ],
  },
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan').setAction(async (_, hre) => {
  for (const [name, args] of Object.entries(contracts)) {
    console.log(`verifying ${name}...`);
    try {
      await hre.run('verify:verify', {
        ...args,
      });
    } catch (e) {
      console.error(e);
    }
  }
});
