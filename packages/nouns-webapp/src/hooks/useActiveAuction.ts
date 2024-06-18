import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { Auction } from '../wrappers/nounsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    nounId: BigNumber.from(reduxSafeAuction.nounId),
    settled: false,
    blockNumber: reduxSafeAuction.blockNumber,
  };
};

export const useActiveAuction = (): Auction | undefined => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);

  return activeAuction ? deserializeAuction(activeAuction) : undefined;
};
