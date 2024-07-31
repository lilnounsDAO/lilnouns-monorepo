import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export interface BidEvent {
  nounId: BigNumberish;
  comment: string;
  sender: string;
  value: BigNumberish;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumberish;
}

export interface Bid {
  nounId: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
  comment: string;
  transactionHash: string;
  timestamp: BigNumber;
}

export interface AuctionVrgdaConfig {
  reservePrice: BigNumber;
  targetPrice: BigNumber;
  updateInterval: number;
  poolSize: number;
}
