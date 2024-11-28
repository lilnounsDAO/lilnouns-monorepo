import { BigInt, log } from '@graphprotocol/graph-ts';
import { Auction, Noun, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';
import { AuctionSettled } from './types/LilVRGDA/LilVRGDA';

export function handleAuctionSettled(event: AuctionSettled): void {
  const nounId = event.params.nounId.toString();
  const bidderAddress = event.params.winner.toHex();

  // Fetch the noun information
  const noun = Noun.load(nounId);
  if (!noun) {
    log.error('[handleAuctionSettled] Noun #{} not found. Hash: {}', [nounId, event.transaction.hash.toHex()]);
    return;
  }

  const bidder = getOrCreateAccount(bidderAddress);

  // Load the settled auction
  let settledAuction = Auction.load(nounId);
  if (!settledAuction) {
    settledAuction = new Auction(nounId);
    settledAuction.startTime = event.block.timestamp;
    settledAuction.amount = BigInt.zero();
    settledAuction.vrgda = true;
  }
  settledAuction.settled = true;
  settledAuction.noun = noun.id;
  settledAuction.amount = event.params.amount;
  settledAuction.bidder = bidder.id;
  settledAuction.endTime = event.block.timestamp;
  settledAuction.save();

  // Create and save the bid
  const bid = new Bid(event.transaction.hash.toHex());
  bid.bidder = bidder.id;
  bid.amount = event.params.amount;
  bid.noun = noun.id;
  bid.txHash = event.transaction.hash;
  bid.txIndex = event.transaction.index;
  bid.blockNumber = event.block.number;
  bid.blockTimestamp = event.block.timestamp;
  bid.auction = settledAuction.id;
  bid.comment = '';
  bid.save();

  // Determine the next auction ID, ensuring after x9 is x2
  const increment = nounId.endsWith('9') ? BigInt.fromI32(3) : BigInt.fromI32(1);
  const newAuctionId = BigInt.fromString(nounId).plus(increment).toString();

  // Create and save the new auction
  const newAuction = new Auction(newAuctionId);
  newAuction.noun = null;
  newAuction.startTime = event.block.timestamp.plus(BigInt.fromI32(1));
  newAuction.endTime = BigInt.zero()
  newAuction.amount = BigInt.zero()
  newAuction.settled = false;
  newAuction.vrgda = true;
  newAuction.save();
}
