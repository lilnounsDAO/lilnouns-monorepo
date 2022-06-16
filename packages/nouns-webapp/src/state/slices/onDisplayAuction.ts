import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionNounId: number | undefined;
  lastAuctionStartTime: number | undefined;
  onDisplayAuctionNounId: number | undefined;
  onDisplayAuctionStartTime: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionNounId: undefined,
  lastAuctionStartTime: undefined,
  onDisplayAuctionNounId: undefined,
  onDisplayAuctionStartTime: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionNounId: (state, action: PayloadAction<number>) => {
      state.lastAuctionNounId = action.payload;
    },
    setLastAuctionStartTime: (state, action: PayloadAction<number>) => {
      state.lastAuctionStartTime = action.payload;
    },
    setOnDisplayAuctionNounId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionNounId = action.payload;
    },
    setOnDisplayAuctionStartTime: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionStartTime = action.payload;
    },
    setPrevOnDisplayAuctionNounId: state => {
      if (!state.onDisplayAuctionNounId) return;
      if (state.onDisplayAuctionNounId === 0) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId - 1;
    },
    setNextOnDisplayAuctionNounId: state => {
      if (state.onDisplayAuctionNounId === undefined) return;
      if (state.lastAuctionNounId === state.onDisplayAuctionNounId) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId + 1;
    },
  },
});

export const {
  setLastAuctionNounId,
  setLastAuctionStartTime,
  setOnDisplayAuctionStartTime,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
