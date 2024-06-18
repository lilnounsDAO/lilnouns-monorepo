import BigNumber from 'bignumber.js';
import { useAppSelector } from '../../hooks';
import { useBuyNoun } from '../../hooks/useBuyNoun';
import { Auction } from '../../wrappers/nounsAuction';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionNavigation from '../AuctionNavigation';
import { AuctionPriceRange } from '../AuctionPriceRange/AuctionPriceRange';
import { AuctionTimer } from '../AuctionTimer/AuctionTimer';
import TruncatedAmount from '../TruncatedAmount';

interface Props {
  auction: Auction;
}

export const AuctionNextNoun = (props: Props) => {
  const { auction } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const config = useAppSelector(state => state.auction.config);

  if (!config) return null;

  const labelColor = isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)';
  const valueColor = isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)';

  const { buyNoun, isLoading } = useBuyNoun();

  return (
    <div className="font-ptRoot max-sm:px-6">
      <div className="flex items-center space-x-2">
        <AuctionNavigation nounId={auction.nounId.toNumber()} />
        <AuctionActivityDateHeadline startTime={auction.startTime} />
      </div>
      <AuctionActivityNounTitle isCool={isCool} nounId={auction.nounId} />
      <div className="flex space-x-10">
        <dl className="pr-10" style={{ borderRight: '1px solid #79809c49' }}>
          <dt style={{ color: labelColor }} className="mb-1 text-lg font-bold">
            Current price
          </dt>
          <dd style={{ color: valueColor }} className="font-bold text-3xl">
            <TruncatedAmount amount={BigNumber(auction.amount.toString())} decimals={3} />
          </dd>
        </dl>
        <dl>
          <dt style={{ color: labelColor }} className="mb-1 text-lg font-bold">
            Price drops in
          </dt>
          <dd style={{ color: valueColor }} className="font-bold text-3xl">
            <AuctionTimer
              startTime={auction.startTime.toNumber()}
              updateInterval={config.updateInterval}
            />
          </dd>
        </dl>
      </div>
      <div className="mt-2">
        <AuctionPriceRange
          currentPrice={auction.amount}
          targetPrice={config.targetPrice}
          reservePrice={config.reservePrice}
        />
      </div>
      <div className="mt-6">
        <button
          type="button"
          className="py-2.5 px-6 font-bold text-lg text-center text-white rounded-xl border-none hover:opacity-80 duration-100"
          style={{ backgroundColor: 'var(--brand-dark-red)' }}
          onClick={() => buyNoun(auction.blockNumber!)}
          disabled={isLoading}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
