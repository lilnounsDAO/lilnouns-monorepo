import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: BigNumber; decimals?: number }> = props => {
  const { amount, decimals = 2 } = props;

  const eth = new BigNumber(utils.formatEther(amount.toString())).toFixed(decimals);
  return <>Ξ {`${eth}`}</>;
};
export default TruncatedAmount;
