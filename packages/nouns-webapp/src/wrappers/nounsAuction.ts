import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, BigNumberish, utils } from 'ethers';
import { NounsAuctionHouseABI } from '@lilnounsdao/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { BigNumber as bNum } from '@ethersproject/bignumber';
import { findAuction, isNounderNoun, isNounsDAONoun } from '../utils/nounderNoun';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';
import AUCTION_ABI from '../libs/abi/vrgda.json';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nouns = 'nouns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder?: string;
  endTime?: EthersBN;
  startTime: EthersBN;
  nounId: EthersBN;
  settled: boolean;

  //vrgda
  seed: [EthersBN, EthersBN, EthersBN, EthersBN, EthersBN];
  svg: string;
  updateInterval: EthersBN;
  //the time the auction will drop in price
  priceDropTime?: Date;
  blocksRemaining?: EthersBN;
  parentBlockHash?: BigNumberish;
}

const abi = new utils.Interface(AUCTION_ABI);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    abi,
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  });
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: '0xe6A9B92c074520de8912EaA4591db1966E2e2B92',
    method: 'fetchNextNoun',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a Noun could vote
 * Small Revision by lil nouns dao to account for lil nounder and nouns dao rewards
 * @param nounId TokenId of Noun
 * @returns Unix timestamp after which Noun could vote
 */

export const useNounCanVoteTimestamp = (nounId: number) => {
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (isNounderNoun(EthersBN.from(nounId)) || isNounsDAONoun(EthersBN.from(nounId))) {
    const distanceToAuctionAbove = isNounderNoun(EthersBN.from(nounId)) ? 2 : 1;
    const auctionAbove = findAuction(
      EthersBN.from(nounId).add(distanceToAuctionAbove),
      pastAuctions,
    );

    return EthersBN.from(auctionAbove?.startTime || 0);
  }

  const auction = findAuction(EthersBN.from(nounId), pastAuctions);
  return auction?.startTime ? EthersBN.from(auction?.startTime) : EthersBN.from(0);
};
