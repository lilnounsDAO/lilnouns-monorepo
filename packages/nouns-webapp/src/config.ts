import {
  ContractAddresses as NounsContractAddresses,
  getBigNounsContractAddressesForChainOrThrow,
  getContractAddressesForChainOrThrow,
} from '@lilnounsdao/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
  weth: string | undefined;
  steth: string | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  nounsDAOSubgraphApiUri: string;
  enableHistory: boolean;
  nounsApiUri: string;
  enableRollbar: boolean;
  zoraKey: string;
}

export const ChainId_Sepolia = 11155111;
type SupportedChains =
  | ChainId.Rinkeby
  | ChainId.Mainnet
  | ChainId.Hardhat
  | ChainId.Goerli
  | typeof ChainId_Sepolia;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seedExpriy: {
    name: 'seedExpriy',
    version: 'v1',
  },
  bigNounSeed: {
    name: 'bigNounSeed',
    version: 'v1',
  },
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

export const WALLET_CONNECT_V2_PROJECT_ID =
  process.env.REACT_APP_WALLET_CONNECT_V2_PROJECT_ID ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
const ALCHEMY_PROJECT_ID = process.env.REACT_APP_ALCHEMY_PROJECT_ID;
const ALCHEMY_SEPOLIA_PROJECT_ID = process.env.REACT_APP_ALCHEMY_SEPOLIA_PROJECT_ID;

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];

  if (network === 'rinkeby' || network === 'goerli') {
    return `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
  } else if (network === 'sepolia') {
    return `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA_PROJECT_ID}`;
  } else {
    return custom || isLocalhost
      ? `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`
      : `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}`;
  }
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];

  if (network === 'rinkeby' || network === 'goerli') {
    return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
  } else if (network === 'sepolia') {
    return `wss://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA_PROJECT_ID}`;
  } else {
    return custom || isLocalhost
      ? `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`
      : `wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}`;
  }
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri: createNetworkHttpUrl('rinkeby'),
    wsRpcUri: createNetworkWsUrl('rinkeby'),
    subgraphApiUri:
      'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph-rinkeby',
    nounsDAOSubgraphApiUri:
      'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_RINKEBY_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId.Goerli]: {
    jsonRpcUri: createNetworkHttpUrl('goerli'),
    wsRpcUri: createNetworkWsUrl('goerli'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph-goerli',
    nounsDAOSubgraphApiUri: 'https://api.thegraph.com/subgraphs/name/bcjgit/dao-v2-test',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_RINKEBY_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId_Sepolia]: {
    jsonRpcUri: createNetworkHttpUrl('sepolia'),
    wsRpcUri: createNetworkWsUrl('sepolia'),
    subgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldjvjgtylso13swq3dre13sf/subgraphs/lil-nouns-sepolia/0.1.4/gn',
    nounsDAOSubgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-sepolia-the-burn/0.1.0/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldjvjgtylso13swq3dre13sf/subgraphs/lil-nouns-subgraph/1.0.6/gn',
    nounsDAOSubgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_MAINNET_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    nounsDAOSubgraphApiUri: '',
    enableHistory: false,
    nounsApiUri: 'http://localhost:5001',
    enableRollbar: false,
    zoraKey: '',
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Rinkeby]: {
    lidoToken: '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD',
    weth: undefined,
    steth: undefined,
  },
  [ChainId.Goerli]: {
    lidoToken: '0x2DD6530F136D2B56330792D46aF959D9EA62E276',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    steth: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
    weth: undefined,
    steth: undefined,
  },
  [ChainId_Sepolia]: {
    lidoToken: undefined,
    weth: undefined,
    steth: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const getBigNounsAddresses = (): Omit<
  ContractAddresses,
  'lilVRGDA' | 'nounsSeederV2' | 'lilVRGDAProxy'
> => {
  let bigNounsNounsAddresses = {} as Omit<
    NounsContractAddresses,
    'lilVRGDA' | 'nounsSeederV2' | 'lilVRGDAProxy'
  >;
  try {
    bigNounsNounsAddresses = getBigNounsContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...bigNounsNounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  isPreLaunch: process.env.REACT_APP_IS_PRELAUNCH || 'false',
  addresses: getAddresses(),
  bigNounsAddresses: getBigNounsAddresses(),
};

export default config;

export const multicallOnLocalhost = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
