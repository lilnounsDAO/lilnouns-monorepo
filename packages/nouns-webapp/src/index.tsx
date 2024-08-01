import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useQuery,
} from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { Provider as RollbarProvider } from '@rollbar/react';
import { Chain, ChainId, DAppProvider, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import dotenv from 'dotenv';
import { BigNumber } from 'ethers';
import { History, createBrowserHistory } from 'history';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PreloadedState, applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import config, {
  CHAIN_ID,
  ChainId_Sepolia,
  createNetworkHttpUrl,
  multicallOnLocalhost,
} from './config';
import { useAppDispatch, useAppSelector } from './hooks';
import { ErrorModalProvider } from './hooks/useApiError';
import { AuthProvider } from './hooks/useAuth';
import './index.css';
import reportWebVitals from './reportWebVitals';
import account from './state/slices/account';
import application from './state/slices/application';
import auction, { setActiveAuction, setConfig, setNouns } from './state/slices/auction';
import logs from './state/slices/logs';
import onDisplayAuction, {
  setLastAuctionNounId,
  setLastAuctionStartTime,
  setOnDisplayAuctionStartTime,
} from './state/slices/onDisplayAuction';
import pastAuctions, { addPastAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import { isNounderNoun } from './utils/nounderNoun';
import { getVrgdaAuctionConfig, getVrgdaAuctions, useBlockListener } from './utils/vrgdaAuction';
import { latestAuctionsQuery, singularAuctionQuery } from './wrappers/subgraph';

dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const supportedChainURLs = {
  [ChainId.Rinkeby]: createNetworkHttpUrl('rinkeby'),
  [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
  [ChainId.Hardhat]: 'http://localhost:8545',
  [ChainId.Goerli]: createNetworkHttpUrl('goerli'),
  [ChainId_Sepolia]: createNetworkHttpUrl('sepolia'),
};

export const Sepolia: Chain = {
  chainId: ChainId_Sepolia,
  chainName: 'Sepolia',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x6a19Dbfc67233760E0fF235b29158bE45Cc53765',
  getExplorerAddressLink: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://sepolia.etherscan.io/tx/${transactionHash}`,
};

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: supportedChainURLs[CHAIN_ID],
  },
  multicallAddresses: {
    [ChainId.Hardhat]: multicallOnLocalhost,
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS, Sepolia],
};

const defaultLink = new HttpLink({
  uri: config.app.subgraphApiUri,
});

const nounsDAOLink = new HttpLink({
  uri: config.app.nounsDAOSubgraphApiUri,
});

const nounsDAOVotingSnapshotLink = new HttpLink({
  uri: 'https://hub.snapshot.org/graphql',
});

const zoraAPILink = new HttpLink({
  uri: 'https://api.zora.co/graphql',
});

const uniswapAPILink = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
});

//pass them to apollo-client config
const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'NounsDAO',
    nounsDAOLink, //if above
    ApolloLink.split(
      operation => operation.getContext().clientName === 'NounsDAOSnapshot',
      nounsDAOVotingSnapshotLink,
      ApolloLink.split(
        operation => operation.getContext().clientName === 'ZoraAPI',
        zoraAPILink,
        ApolloLink.split(
          operation => operation.getContext().clientName === 'LilNounsDAO',
          defaultLink,
          ApolloLink.split(
            operation => operation.getContext().clientName === 'Uniswap',
            uniswapAPILink,
            defaultLink,
          ),
        ),
      ),
    ),
  ),
  cache: new InMemoryCache(),
});

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();
  const poolSize = useAppSelector(state => state.auction.config?.poolSize);

  // Get the VRGDA auction settings
  useEffect(() => {
    getVrgdaAuctionConfig().then(config => {
      if (!config) return;
      dispatch(setConfig(config));
      getAndDispatchAuctionsData(config.poolSize);
    });
  }, []);

  // Refresh auction data on new blocks
  useBlockListener(async () => {
    if (typeof poolSize === 'undefined') return;
    getAndDispatchAuctionsData(poolSize);
  });

  async function getAndDispatchAuctionsData(poolSize: number) {
    const data = await getVrgdaAuctions(poolSize);
    if (!data) return;

    dispatch(setLastAuctionStartTime(data.startTime.toNumber()));
    dispatch(setLastAuctionNounId(Number(data.nextNoun.id)));

    dispatch(
      setActiveAuction({
        nounId: BigNumber.from(data.nextNoun.id),
        amount: data.currentPrice,
        startTime: data.startTime,
        settled: false,
        blockNumber: data.nextNoun.blockNumber,
      }),
    );

    dispatch(setNouns({ next: data.nextNoun, previous: data.previousNouns }));
  }

  return <></>;
};

//UPDATE: Using Auction start timestmap to fetch backwards beyond last 1000 aucitons
const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const latestAuctionStartTime = useAppSelector(
    state => state.onDisplayAuction.lastAuctionStartTime,
  );
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionNounId,
  );
  const onDisplayAuctionStartTime = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionStartTime,
  );

  const nounId = BigNumber.from(onDisplayAuctionNounId ?? 0);
  const distanceToAuctionAbove = isNounderNoun(BigNumber.from(onDisplayAuctionNounId ?? 0)) ? 2 : 1;
  const nextNounId = nounId.add(distanceToAuctionAbove);

  const { data: postData } = useQuery(singularAuctionQuery(nextNounId?.toString() || '0'));

  const { data } = useQuery(
    latestAuctionsQuery(postData?.auctions?.[0]?.startTime || onDisplayAuctionStartTime || 0),
  );

  const { data: auctionData } = useQuery(
    singularAuctionQuery(onDisplayAuctionNounId?.toString() || '0'),
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) return;
    dispatch(addPastAuctions({ data }));
  }, [data]);

  useEffect(() => {
    if (!auctionData) return;
    dispatch(setOnDisplayAuctionStartTime(auctionData?.auctions?.[0]?.startTime));
  }, [auctionData]);

  return <></>;
};

const rollbarConfig = {
  accessToken: 'a5a33e0a7d9a4c33a4ac4fd8ee4e85a1',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
  enabled: config.app.enableRollbar,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true,
      },
    },
  },
};

ReactDOM.render(
  <RollbarProvider config={rollbarConfig}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ChainSubscriber />
        <React.StrictMode>
          <Web3ReactProvider
            getLibrary={
              provider => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
            }
          >
            <ApolloProvider client={client}>
              <PastAuctions />
              <DAppProvider config={useDappConfig}>
                <ErrorModalProvider>
                  <AuthProvider>
                    <App />
                    <Updaters />
                  </AuthProvider>
                </ErrorModalProvider>
              </DAppProvider>
            </ApolloProvider>
          </Web3ReactProvider>
        </React.StrictMode>
      </ConnectedRouter>
    </Provider>
    ,
  </RollbarProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
