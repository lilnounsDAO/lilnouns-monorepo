import { ChainId, ContractAddresses } from './types';

const chainIdToAddresses: { [chainId: number]: ContractAddresses } = {
  [ChainId.Mainnet]: {
    nounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    nounsSeeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
    nounsDescriptor: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
    nftDescriptor: '0x0BBAd8c947210ab6284699605ce2a61780958264',
    nounsAuctionHouse: '0xF15a943787014461d94da08aD4040f79Cd7c124e',
    nounsAuctionHouseProxy: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    nounsAuctionHouseProxyAdmin: '0xC1C119932d78aB9080862C5fcb964029f086401e',
    nounsDaoExecutor: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    nounsDAOProxy: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    nounsDAOLogicV1: '0xa43aFE317985726E4e194eb061Af77fbCb43F944',
  },
  [ChainId.Rinkeby]: {
    nounsToken: '0xF0ea2Ef2E31c9A4A74471cA6101BD755262c940a', 
    nounsSeeder: '0x4451D889B6B8c9b0f11E3C9C2d5d27ddF4057a00', 
    nounsDescriptor: '0x43D17060Bd13a1DBb18aE54958C13eEccbf2017B',
    nftDescriptor: '0x1A1251F943E3C3Fd09a0aafEfDa4e3309032779c', 
    nounsAuctionHouse: '0x91BACcA4AC068fddBBAA0ABfa00E1718Baa6f047', 
    nounsAuctionHouseProxy: '0xbE66dc5a75F81a78932009AD263C29f9248D638d',
    nounsAuctionHouseProxyAdmin: '0x1075083AE2E9Cf121a64A682C36F8e82dAb0B3B1',
    nounsDaoExecutor: '0x17E7b56953C39d3b2869E936e6D4D7bb04d5323E', 
    nounsDAOProxy: '0xEF3d6a6c4dc884Cd0f360886A592b811F2C29278', 
    nounsDAOLogicV1: '0x72Efac273bd36A82DF3a32013c6A136726A9581f', 
  },
  [ChainId.Local]: {
    nounsToken: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    nounsSeeder: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    nounsDescriptor: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    nftDescriptor: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    nounsAuctionHouse: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    nounsAuctionHouseProxy: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    nounsAuctionHouseProxyAdmin: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    nounsDaoExecutor: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    nounsDAOProxy: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    nounsDAOLogicV1: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  },
};

/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
export const getContractAddressesForChainOrThrow = (chainId: number): ContractAddresses => {
  if (!chainIdToAddresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return chainIdToAddresses[chainId];
};
