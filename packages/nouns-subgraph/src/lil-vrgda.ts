import { BigInt, log } from '@graphprotocol/graph-ts'
import { Auction, Noun, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { AuctionSettled } from './types/LilVRGDA/LilVRGDA';

// export function handleAuctionReservePriceUpdated(event: AuctionReservePriceUpdated): void {
// event.params.reservePrice
// }

export function handleAuctionSettled(event: AuctionSettled): void {
  let nounId = event.params.nounId.toString();
  let bidderAddress = event.params.winner.toHex();

  let bidder = getOrCreateAccount(bidderAddress);

  let noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleAuctionCreated] Noun #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  let auction = new Auction(nounId); //VRGDA(nounId);
  auction.noun = noun.id;
  auction.amount = event.params.amount;
  auction.bidder = bidder.id;
  auction.startTime = BigInt.fromI32(0);
  auction.endTime = BigInt.fromI32(0);
  auction.settled = true;

  // auction.vrgda = true; set to false at nouns-auction-house.ts

  auction.save();

  // Save Bid (Buy)
  let bid = new Bid(event.transaction.hash.toHex());
  bid.bidder = bidder.id;
  bid.amount = auction.amount;
  bid.noun = auction.noun;
  bid.txIndex = event.transaction.index;
  bid.blockNumber = event.block.number;
  bid.blockTimestamp = event.block.timestamp;
  bid.auction = auction.id;

  // if (event.params.comment != '') {
  //   bid.comment = event.params.comment;
  // } else {
    bid.comment = '';
  // }

  bid.save();
}

