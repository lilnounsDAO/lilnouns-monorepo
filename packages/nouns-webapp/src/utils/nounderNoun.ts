import { Auction } from '../wrappers/nounsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0);
};

//? checks for nounsdao gifted nouns
export const isNounsDAONoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(1) || nounId.eq(1);
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

export const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.nounId).eq(id);
  })?.activeAuction;
};



//TODO: checkout
/**
 *
 * @param nounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(nounId.toNumber());

  // When the 9th Lil Noun's auction is settled, three events occur:
  // (1) a newly minted Lil Noun is sent to the Lil Nouns DAO
  // (2) a newly minted Lil Noun is sent to the Nouns DAO
  // (3) a new Lil Noun auction is started (`auctionAbove`)
  // Since neither (1) nor (2) go through an auction, their `startTime` is derived from the `auctionAbove`.
  const distanceToAuctionAbove = isNounderNoun(BigNumber.from(nounId)) ? 2 : 1;
  const auctionAbove = findAuction(nounId.add(distanceToAuctionAbove), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
