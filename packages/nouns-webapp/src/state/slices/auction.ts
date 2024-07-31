import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INoun } from '../../components/StandaloneNoun';
import { AuctionVrgdaConfig, BidEvent } from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface AuctionState {
  activeAuction?: IAuction;
  bids: BidEvent[];
  config?: AuctionVrgdaConfig;
  nouns?: {
    next: INoun;
    previous: INoun[];
  };
}

const initialState: AuctionState = {
  activeAuction: undefined,
  bids: [],
  config: {
    reservePrice: BigNumber.from(0),
    targetPrice: BigNumber.from(0),
    updateInterval: 0,
    poolSize: 0,
  },
};

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: auction.endTime ? BigNumber.from(auction.endTime).toJSON() : undefined,
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
  blockNumber: auction.blockNumber,
});

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<IAuction>) => {
      state.activeAuction = reduxSafeAuction(action.payload);
      console.debug(`set active auction: `, action.payload);
    },
    setConfig: (state, action: PayloadAction<AuctionVrgdaConfig>) => {
      state.config = action.payload;
      console.debug('set auction config: ', action.payload);
    },
    setNouns: (state, action: PayloadAction<{ next: INoun; previous: INoun[] }>) => {
      state.nouns = action.payload;
      console.debug('set auction nouns: ', action.payload);
    },
  },
});

export const { setActiveAuction, setConfig, setNouns } = auctionSlice.actions;

export default auctionSlice.reducer;
