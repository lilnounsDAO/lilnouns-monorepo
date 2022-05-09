import { Interface } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { default as NounsAuctionHouseABI } from '../abi/contracts//NounsAuctionHouse.sol/NounsAuctionHouse.json';

type ContractName =
  // | 'NFTDescriptor'
  // | 'NounsDescriptor'
  // | 'NounsSeeder'
  // | 'NounsToken';
  // | 'NounsAuctionHouse'
  | 'NounsAuctionHouseProxyAdmin'
  // | 'NounsAuctionHouseProxy'
  // | 'NounsDAOExecutor'
  // | 'NounsDAOLogicV1'
  // | 'NounsDAOProxy';


  const bytes = new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
    "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B", // nouns token
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // weth (mainnet)
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


const expectedAuctionHouseProxyAddress = '0x55790b9183638981cEfbD5627C5C47C1f0f2Af29'
const expectedNounsDAOProxyAddress = '0x2c61E1eED8a2da827899341cc2ffEBFf556f17c3'

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

  // NounsToken: {
  //   address: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
  //   constructorArguments: [
  //     '0x3cf6a7f06015aCad49F76044d3c63D7fE477D945', // lilnounders dao multisig
  //     '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10', // nouns dao treasury
  //     '0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E', // nounsAuctionHouseProxy //expectedAuctionHouseProxyAddress = '0x55790b9183638981cEfbD5627C5C47C1f0f2Af29'
  //     '0x11fb55d9580cdbfb83de3510ff5ba74309800ad1', // nounsDescriptor
  //     '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515', // nounsSeeder
  //     '0xa5409ec958c83c3f309868babaca7c86dcb077c1', // mainnet opensea registry
  //   ],
  // },
  // NounsAuctionHouse: {
  //   address: '0x5B2003cA8FE9FfB93684cE377f52B415C7dC0216',
  // },

  //*this one
  NounsAuctionHouseProxyAdmin: {
    address: '0xA4BebeC5bf3670Bb47a55ff705c91956C703237B',
  },

  // NounsAuctionHouseProxy: {
  //   address: '0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E', //expectedAuctionHouseProxyAddress = '0x55790b9183638981cEfbD5627C5C47C1f0f2Af29'
  //   constructorArguments: [
  //     '0x5B2003cA8FE9FfB93684cE377f52B415C7dC0216', // NounAuctionHouse
  //     '0xA4BebeC5bf3670Bb47a55ff705c91956C703237B', // nounsAuctionHouseProxyAdmin
  //     bytes,
  //   ],
  // },


  // NounsDAOExecutor: {
  //   address: '0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB',
  //   constructorArguments: ['0x5d2C31ce16924C2a71D317e5BbFd5ce387854039', 172800], // nounsDAOProxy, timelock-delay
  // },
  // NounsDAOLogicV1: {
  //   address: '0x8b20b261BDF0f97cfc6D3bD4903beb9D17794Ed8', // nounsDAOLogicV1
  // },
  // NounsDAOProxy: {
  //   address: '0x5d2C31ce16924C2a71D317e5BbFd5ce387854039', // nounsDAOProxy
  //   constructorArguments: [
  //     '0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB', // nounsDaoExecutor
  //     '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B', // nounsToken
  //     '0x3cf6a7f06015aCad49F76044d3c63D7fE477D945', // lilnounders dao multisig
  //     '0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB', // nounsDaoExecutor
  //     '0x8b20b261BDF0f97cfc6D3bD4903beb9D17794Ed8', // nounsDAOLogicV1
  //     33230, // voting-period 
  //     26585, // voting-delay
  //     100, // proposal-threshold-bps
  //     1_000, // quorum-votes-bps
  //   ],
  // },
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
