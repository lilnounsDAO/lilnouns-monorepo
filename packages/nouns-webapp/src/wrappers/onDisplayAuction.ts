import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun, isNounsDAONoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    nounId: BigNumber.from(reduxSafeAuction.nounId),
    settled: false,
    seed: [
      BigNumber.from(reduxSafeAuction.seed[0]),
      BigNumber.from(reduxSafeAuction.seed[1]),
      BigNumber.from(reduxSafeAuction.seed[2]),
      BigNumber.from(reduxSafeAuction.seed[3]),
      BigNumber.from(reduxSafeAuction.seed[4]),
    ],
    //update interval
    updateInterval: BigNumber.from(reduxSafeAuction.updateInterval),
    parentBlockHash: reduxSafeAuction.parentBlockHash,
    svg: reduxSafeAuction.svg,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    nounId: BigNumber.from(reduxSafeBid.nounId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.auction.activeAuction?.nounId);
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionNounId === undefined ||
    lastAuctionNounId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  //TODO figure out last auction noun id
  return deserializeAuction(currentAuction);

  // current auction
  // if (BigNumber.from(onDisplayAuctionNounId).eq(lastAuctionNounId)) {
  //   return deserializeAuction(currentAuction);
  // } else {
  //   // nounder auction
  //   if (
  //     isNounderNoun(BigNumber.from(onDisplayAuctionNounId)) ||
  //     isNounsDAONoun(BigNumber.from(onDisplayAuctionNounId))
  //   ) {
  //     const emptyNounderAuction = generateEmptyNounderAuction(
  //       BigNumber.from(onDisplayAuctionNounId),
  //       pastAuctions,
  //     );

  //     return deserializeAuction(emptyNounderAuction);
  //   } else {
  //     // past auction
  //     const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
  //       const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
  //       return nounId && nounId.toNumber() === onDisplayAuctionNounId;
  //     })?.activeAuction;

  //     console.log('dor', 'd');
  //     console.log('reduxSafeAuction', reduxSafeAuction);

  //     return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
  //   }
  // }
};

export const useAuctionBids = (auctionNounId: BigNumber): Bid[] | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionNounId === auctionNounId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
      return nounId && nounId.eq(auctionNounId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
