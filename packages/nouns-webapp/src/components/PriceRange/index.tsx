import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import PriceDropModal from '../PriceDropModal';

dayjs.extend(duration);

const PriceBlock: React.FC<{
  bgColor: string;
  isActive: boolean;
}> = props => {
  const { bgColor, isActive } = props;
  return (
    <>
      <div
        style={{
          border: isActive ? '2px solid #000' : 'none',
        }}
        className={`md:w-[25px] md:h-[25px] w-[20px] h-[20px] bg-[var(--brand-warm-accent)] ${bgColor}`}
      ></div>
    </>
  );
};

const PriceRange: React.FC<{
  auction: Auction;
}> = props => {
  const { auction } = props;

  if (!auction) return null;

  const [showPriceDropModal, setShowPriceDropModal] = useState(false);
  const showPriceDropHandler = () => {
    setShowPriceDropModal(true);
  };
  const dismissPriceDropModal = () => {
    setShowPriceDropModal(false);
  };

  const MAX_PRICE = 1;
  const MIN_PRICE = 0.05;
  const MID_PRICE = MAX_PRICE - (MAX_PRICE - MIN_PRICE) / 2;

  // const currentPrice = auction.currentPrice;
  const currentPrice = auction.amount.toNumber() / 10 ** 18;

  const numPriceBlocks = 15;

  const activeIndex =
    numPriceBlocks - (Math.floor((currentPrice / MAX_PRICE) * numPriceBlocks) - 1);

  const colorsClassNames = [
    'bg-[#FF638D]',
    'bg-[#FF638D]',
    'bg-[#FF638D]',
    'bg-[#FF9564]',
    'bg-[#FFB946]',
    'bg-[#FFCB37]',
    'bg-[#FFEF17]',
    'bg-[#FFEF17]',
    'bg-[#FFEF17]',
    'bg-[#C6D254]',
    'bg-[#8FB78E]',
    'bg-[#5D9DC3]',
    'bg-[#2B83F6]',
    'bg-[#2B83F6]',
    'bg-[#2B83F6]',
  ];

  return (
    <>
      {showPriceDropModal && <PriceDropModal onDismiss={dismissPriceDropModal} />}
      <div className="inline-block relative">
        <div className="flex justify-between">
          <h4
            className="mb-0 font-bold"
            style={{
              color: 'var(--brand-warm-light-text)',
            }}
          >
            Ξ{MAX_PRICE}
          </h4>
          <h4
            className="mb-0 font-bold"
            style={{
              color: 'var(--brand-warm-light-text)',
            }}
          >
            Ξ{MID_PRICE}
          </h4>
          <h4
            className="mb-0 font-bold"
            style={{
              color: 'var(--brand-warm-light-text)',
            }}
          >
            Ξ{MIN_PRICE}
          </h4>
        </div>

        <div className="flex flex-row items-center justify-start  space-x-[4px] mt-[8px]">
          {colorsClassNames.map((color, index) => {
            return <PriceBlock bgColor={color} isActive={index === activeIndex} />;
          })}
        </div>
        <>
          <div
            className="absolute mt-1.5 rounded-lg border-solid border-b-black border-b-8 border-x-transparent border-x-8 border-t-0"
            style={{
              left: `${(1 + activeIndex) * 25}px`,
            }}
          ></div>
        </>
      </div>
    </>
  );
};

export default PriceRange;
