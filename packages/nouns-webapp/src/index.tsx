import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import logs from './state/slices/logs';
import auction, {
  reduxSafeAuction,
  reduxSafeNewAuction,
  reduxSafeBid,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import onDisplayAuction, {
  setLastAuctionNounId,
  setLastAuctionStartTime,
  setOnDisplayAuctionNounId,
  setOnDisplayAuctionStartTime,
} from './state/slices/onDisplayAuction';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  Operation,
  useQuery,
} from '@apollo/client';
import { clientFactory, latestAuctionsQuery, singularAuctionQuery } from './wrappers/subgraph';
import { useEffect } from 'react';
import pastAuctions, { addPastAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, createNetworkHttpUrl, multicallOnLocalhost } from './config';
import { WebSocketProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, providers } from 'ethers';
import { NounsAuctionHouseFactory } from '@lilnounsdao/sdk';
import dotenv from 'dotenv';
import { useAppDispatch, useAppSelector } from './hooks';
import { appendBid } from './state/slices/auction';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers, PreloadedState } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nounPath } from './utils/history';
import { push } from 'connected-react-router';
import { AuthProvider } from './hooks/useAuth';
import { ErrorModalProvider } from './hooks/useApiError';

import { Provider as RollbarProvider } from '@rollbar/react';
import { isNounderNoun } from './utils/nounderNoun';

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

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: createNetworkHttpUrl('rinkeby'),
    [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Goerli]:  createNetworkHttpUrl('goerli'),
  },
  multicallAddresses: {
    [ChainId.Hardhat]: multicallOnLocalhost,
  }
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
        defaultLink,
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

const BLOCKS_PER_DAY = 6_500;

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();

  const loadState = async () => {
    const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
    const nounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
      config.addresses.nounsAuctionHouseProxy,
      wsProvider,
    );

    const bidFilter = nounsAuctionHouseContract.filters.AuctionBid(null, null, null, null);
    const extendedFilter = nounsAuctionHouseContract.filters.AuctionExtended(null, null);
    const createdFilter = nounsAuctionHouseContract.filters.AuctionCreated(null, null, null);
    const settledFilter = nounsAuctionHouseContract.filters.AuctionSettled(null, null, null);
    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any,
    ) => {
      const timestamp = (await event.getBlock()).timestamp;
      const transactionHash = event.transactionHash;
      dispatch(
        appendBid(reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp })),
      );
    };
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
    ) => {
      dispatch(
        setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false })),
      );
      const nounIdNumber = BigNumber.from(nounId).toNumber();
      const startTimeNumber = BigNumber.from(startTime).toNumber();
      dispatch(push(nounPath(nounIdNumber)));
      dispatch(setOnDisplayAuctionNounId(nounIdNumber));
      dispatch(setOnDisplayAuctionStartTime(startTimeNumber));

      dispatch(setLastAuctionNounId(nounIdNumber));
      dispatch(setLastAuctionStartTime(startTimeNumber));
    };
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      dispatch(setAuctionExtended({ nounId, endTime }));
    };
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      dispatch(setAuctionSettled({ nounId, amount, winner }));
    };

    // Fetch the current auction
    const currentAuction = await nounsAuctionHouseContract.auction();
    dispatch(setFullAuction(reduxSafeAuction(currentAuction)));
    dispatch(setLastAuctionNounId(currentAuction.nounId.toNumber()));

    dispatch(setLastAuctionStartTime(currentAuction.startTime.toNumber()));

    // Fetch the previous 24hours of  bids
    const previousBids = await nounsAuctionHouseContract.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY);
    for (const event of previousBids) {
      if (event.args === undefined) return;
      processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    nounsAuctionHouseContract.on(bidFilter, (nounId, sender, value, extended, event) =>
      processBidFilter(nounId, sender, value, extended, event),
    );
    nounsAuctionHouseContract.on(createdFilter, (nounId, startTime, endTime) =>
      processAuctionCreated(nounId, startTime, endTime),
    );
    nounsAuctionHouseContract.on(extendedFilter, (nounId, endTime) =>
      processAuctionExtended(nounId, endTime),
    );
    nounsAuctionHouseContract.on(settledFilter, (nounId, winner, amount) =>
      processAuctionSettled(nounId, winner, amount),
    );
  };
  loadState();

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
    data &&
      auctionData &&
      dispatch(setOnDisplayAuctionStartTime(auctionData?.auctions?.[0]?.startTime)) &&
      dispatch(addPastAuctions({ data }));
  }, [data, auctionData, latestAuctionId, latestAuctionStartTime, dispatch]);

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
