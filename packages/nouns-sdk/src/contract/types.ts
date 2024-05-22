import {
  NounsTokenFactory,
  NounsAuctionHouseFactory,
  NounsDescriptorFactory,
  NounsSeederFactory,
  NounsDaoLogicV1Factory,
  LilVRGDAAFactory,
  NounsSeederV2Factory,
} from '@lilnounsdao/contracts';

export interface ContractAddresses {
  nounsToken: string;
  nounsSeeder: string;
  nounsDescriptor: string;
  nftDescriptor: string;
  nounsAuctionHouse: string;
  nounsAuctionHouseProxy: string;
  nounsAuctionHouseProxyAdmin: string;
  nounsDaoExecutor: string;
  nounsDAOProxy: string;
  nounsDAOLogicV1: string;
  vrgdaAuction: string;
  lilVRGDA?: string;
  nounsSeederV2?: string;
}

export interface Contracts {
  nounsTokenContract: ReturnType<typeof NounsTokenFactory.connect>;
  nounsAuctionHouseContract: ReturnType<typeof NounsAuctionHouseFactory.connect>;
  nounsDescriptorContract: ReturnType<typeof NounsDescriptorFactory.connect>;
  nounsSeederContract: ReturnType<typeof NounsSeederFactory.connect>;
  nounsDaoContract: ReturnType<typeof NounsDaoLogicV1Factory.connect>;
  nounsSeederV2Contract?: ReturnType<typeof NounsSeederV2Factory.connect>;
  lilVRGDAContract?: ReturnType<typeof LilVRGDAAFactory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Sepolia = 11155111,
  Local = 31337,
}
