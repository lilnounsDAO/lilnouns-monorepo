import { BigInt, log } from '@graphprotocol/graph-ts'
import { Auction, Noun, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { AuctionSettled } from './types/LilVRGDA/LilVRGDA';

export function handleAuctionSettled(event: AuctionSettled): void {
  const nounId = event.params.nounId.toString();
  const bidderAddress = event.params.winner.toHex();

  const bidder = getOrCreateAccount(bidderAddress);

  const noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleAuctionCreated] Noun #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  const auction = new Auction(nounId);
  auction.noun = noun.id;
  auction.amount = event.params.amount;
  auction.bidder = bidder.id;
  auction.startTime = BigInt.fromI32(0);
  auction.endTime = BigInt.fromI32(0);
  auction.settled = true;
  auction.vrgda = true;
  auction.save();

  // Save Bid (Buy)
  const bid = new Bid(event.transaction.hash.toHex());
  bid.bidder = bidder.id;
  bid.amount = auction.amount;
  bid.noun = auction.noun;
  bid.txHash = event.transaction.hash;
  bid.txIndex = event.transaction.index;
  bid.blockNumber = event.block.number;
  bid.blockTimestamp = event.block.timestamp;
  bid.auction = auction.id;
  bid.comment = '';
  bid.save();
}

