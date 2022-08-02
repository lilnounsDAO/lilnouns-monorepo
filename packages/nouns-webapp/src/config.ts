import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
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
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

//TODO: replaced infura for prod
export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];

  if (network === 'rinkeby') {
    return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || `https://eth-mainnet.alchemyapi.io/v2/tEAmLPls4-IajaZM2nyTIfG6CqK_uAb0`;
  }
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];

  if (network === 'rinkeby') {
    return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || 'wss://eth-mainnet.alchemyapi.io/v2/tEAmLPls4-IajaZM2nyTIfG6CqK_uAb0';
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
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph',
    nounsDAOSubgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_MAINNET_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    nounsDAOSubgraphApiUri: '',
    enableHistory: false,
    nounsApiUri: 'http://localhost:5001',
    enableRollbar: false,
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Rinkeby]: {
    lidoToken: '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD',
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  isPreLaunch: process.env.REACT_APP_IS_PRELAUNCH || 'false',
  addresses: getAddresses(),
};

export default config;
