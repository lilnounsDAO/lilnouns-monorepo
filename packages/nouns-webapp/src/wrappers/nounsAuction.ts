import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { NounsAuctionHouseABI } from '@nouns/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { BigNumber as bNum } from '@ethersproject/bignumber';
import { findAuction, isNounderNoun, isNounsDAONoun } from '../utils/nounderNoun';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

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
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  nounId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(NounsAuctionHouseABI);

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
    address: config.addresses.nounsAuctionHouseProxy,
    method: 'minBidIncrementPercentage',
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

  if(isNounderNoun(EthersBN.from(nounId)) || isNounsDAONoun(EthersBN.from(nounId))) {
    const distanceToAuctionAbove = isNounderNoun(EthersBN.from(nounId)) ? 2 : 1;
    const auctionAbove = findAuction(EthersBN.from(nounId).add(distanceToAuctionAbove), pastAuctions);

   return EthersBN.from(auctionAbove?.startTime || 0);
  }

  const auction = findAuction(EthersBN.from(nounId), pastAuctions);
  return auction?.startTime ? EthersBN.from(auction?.startTime) : EthersBN.from(0);;

};
