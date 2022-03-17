import { Interface } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { default as NounsAuctionHouseABI } from '../abi/contracts//NounsAuctionHouse.sol/NounsAuctionHouse.json';

type ContractName =
  | 'NFTDescriptor'
  | 'NounsDescriptor'
  | 'NounsSeeder'
  | 'NounsToken'
  | 'NounsAuctionHouse'
  | 'NounsAuctionHouseProxyAdmin'
  | 'NounsDAOExecutor'
  | 'NounsDAOLogicV1'
  | 'NounsDAOProxy'
  | 'NounsAuctionHouseProxy';


  const bytes = new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
    "0xF0ea2Ef2E31c9A4A74471cA6101BD755262c940a", // nouns token
    "0xc778417E063141139Fce010982780140Aa0cD5Ab", // weth (testnet)
    "90", // auctionTimeBuffer,
    "1", // auctionReservePrice,
    "5", // auctionMinIncrementBidPercentage,
    "900", // auctionDuration,
   ])
  

interface VerifyArgs {
  address: string;
  constructorArguments?: (string | number)[];
  libraries?: Record<string, string>;
}

const contracts: Record<ContractName, VerifyArgs> = {
  NFTDescriptor: {
    address: '0x1A1251F943E3C3Fd09a0aafEfDa4e3309032779c',
  },
  NounsDescriptor: {
    address: '0x43D17060Bd13a1DBb18aE54958C13eEccbf2017B',
    libraries: {
      NFTDescriptor: '0x1A1251F943E3C3Fd09a0aafEfDa4e3309032779c',
    },
  },
  NounsSeeder: {
    address: '0x4451D889B6B8c9b0f11E3C9C2d5d27ddF4057a00',
  },
  NounsToken: {
    address: '0xF0ea2Ef2E31c9A4A74471cA6101BD755262c940a',
    constructorArguments: [
      '0x9c1049c2d5fCB8dBB736Fd87E7E0198b03F6EEB3', // lilnounders dao multisig
      '0xd301FBaffd9b81f4Ed47B90360f2137E642111a8', // nouns dao treasury (rinkeby == deployer adderss)
      '0xbE66dc5a75F81a78932009AD263C29f9248D638d', // nounsAuctionHouseProxy
      '0x43D17060Bd13a1DBb18aE54958C13eEccbf2017B', // nounsDescriptor
      '0x4451D889B6B8c9b0f11E3C9C2d5d27ddF4057a00', // nounsSeeder
      '0xf57b2c51ded3a29e6891aba85459d600256cf317', // rinkeby opensea registry
    ],
  },
  NounsAuctionHouse: {
    address: '0x91BACcA4AC068fddBBAA0ABfa00E1718Baa6f047',
  },
  NounsAuctionHouseProxyAdmin: {
    address: '0x1075083AE2E9Cf121a64A682C36F8e82dAb0B3B1',
  },
  NounsAuctionHouseProxy: {
    address: '0xbE66dc5a75F81a78932009AD263C29f9248D638d',
    constructorArguments: [
      '0x91BACcA4AC068fddBBAA0ABfa00E1718Baa6f047', // NounAuctionHouse
      '0x1075083AE2E9Cf121a64A682C36F8e82dAb0B3B1', // nounsAuctionHouseProxyAdmin
      bytes,
    ],
  },
  NounsDAOExecutor: {
    address: '0x17E7b56953C39d3b2869E936e6D4D7bb04d5323E',
    constructorArguments: ['0xEF3d6a6c4dc884Cd0f360886A592b811F2C29278', 172800], // nounsDAOProxy, timelock-delay
  },
  NounsDAOLogicV1: {
    address: '0x72Efac273bd36A82DF3a32013c6A136726A9581f', // nounsDAOLogicV1
  },
  NounsDAOProxy: {
    address: '0xEF3d6a6c4dc884Cd0f360886A592b811F2C29278', // nounsDAOProxy
    constructorArguments: [
      '0x17E7b56953C39d3b2869E936e6D4D7bb04d5323E', // nounsDaoExecutor
      '0xF0ea2Ef2E31c9A4A74471cA6101BD755262c940a', // nounsToken
      '0x9c1049c2d5fCB8dBB736Fd87E7E0198b03F6EEB3', // lilnounders dao multisig
      '0x17E7b56953C39d3b2869E936e6D4D7bb04d5323E', // nounsDaoExecutor
      '0x72Efac273bd36A82DF3a32013c6A136726A9581f', // nounsDAOLogicV1
      17280, // voting-period 
      1, // voting-delay
      500, // proposal-threshold-bps
      1000, // quorum-votes-bps
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
