import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export interface BidEvent {
  nounId: BigNumberish;
  sender: string;
  value: BigNumberish;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumberish;
}

export interface AuctionCreateEvent {
  nounId: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  settled: boolean;
}

export interface AuctionSettledEvent {
  nounId: BigNumberish;
  winner: string;
  amount: BigNumberish;
}

export interface AuctionExtendedEvent {
  nounId: BigNumberish;
  endTime: BigNumberish;
}

export interface Bid {
  nounId: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumber;
}

export type NounVrgdaSeed = [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber];

export type NextNoun = [BigNumber, BigNumber, BigNumber, BigNumber, string, boolean] & {
  nounId: BigNumber;
  seed: NounVrgdaSeed;
  svg: string;
  price: BigNumber;
  hash: BigNumberish;
};
