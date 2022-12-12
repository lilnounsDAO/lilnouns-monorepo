import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import PriceDropModal from '../PriceDropModal';

dayjs.extend(duration);

const PriceBlock: React.FC<{
  bgColor: string;
}> = props => {
  const { bgColor } = props;
  return <div className={`w-[25px] h-[25px] ${bgColor}`}></div>;
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

  return (
    <>
      {showPriceDropModal && <PriceDropModal onDismiss={dismissPriceDropModal} />}

      <div className="flex flex-row items-center justify-center">
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />

        <PriceBlock bgColor="bg-nouns-blue" />

        <PriceBlock bgColor="bg-nouns-blue" />
        <PriceBlock bgColor="bg-nouns-blue" />
      </div>
    </>
  );
};

export default PriceRange;
