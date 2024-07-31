import { BigNumber as BigNumberEthers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import TruncatedAmount from '../TruncatedAmount';

interface Props {
  currentPrice: BigNumberEthers;
  targetPrice: BigNumberEthers;
  reservePrice: BigNumberEthers;
}

export const AuctionPriceRange = (props: Props) => {
  const { currentPrice, targetPrice, reservePrice } = props;

  const numPriceBlocks = blockColors.length;
  const maxPrice = targetPrice.mul(2);

  const currentPricePercentage =
    parseFloat(utils.formatEther(currentPrice)) / parseFloat(utils.formatEther(maxPrice));

  const activeIndex = Math.floor(currentPricePercentage * numPriceBlocks);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full space-x-1">
        {blockColors.map((color, index) => (
          <PriceBlock color={color} key={index} isActive={index === activeIndex} />
        ))}
      </div>
      <div className="mt-2.5 flex justify-between">
        <h4 className="font-medium">
          <TruncatedAmount amount={BigNumber(reservePrice.toString() || '0.00')} />
        </h4>
        <h4 className="font-medium">
          <TruncatedAmount amount={BigNumber(targetPrice.toString() || '0.00')} />
        </h4>
        <h4 className="font-medium">
          <TruncatedAmount amount={BigNumber(maxPrice.toString() || '0.00')} />
        </h4>
      </div>
    </div>
  );
};

const PriceBlock = (props: { color: string; isActive: boolean }) => {
  const { color, isActive } = props;

  return (
    <div
      style={{
        boxShadow: isActive ? `0px 0px 3px 3px rgba(0,0,0,0.4)` : 'none',
        backgroundColor: color,
      }}
      className="w-full aspect-square rounded"
    />
  );
};

const blockColors = [
  '#FF638D',
  '#FF638D',
  '#FF638D',
  '#FF9564',
  '#FFB946',
  '#FFCB37',
  '#FFEF17',
  '#FFEF17',
  '#FFEF17',
  '#C6D254',
  '#8FB78E',
  '#5D9DC3',
  '#2B83F6',
  '#2B83F6',
  '#2B83F6',
] as const;
