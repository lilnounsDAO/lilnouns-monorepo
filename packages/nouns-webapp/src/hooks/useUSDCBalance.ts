import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useUSDCBalance(): string | undefined {
  const { library } = useEthers();
  const [balance, setBalance] = useState<string>();

  const usdcContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.usdcToken) return;
    return new Contract("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!usdcContract || !addresses.payerContract) return;
    usdcContract.balanceOf(addresses.payerContract).then((rawBalance: BigNumber) => {
      const balanceAsNumber = Number(rawBalance.toString()) / 1_000_000;
      const formattedBalance = balanceAsNumber.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setBalance(formattedBalance);
    });
  }, [usdcContract]);

  return balance;
}

export default useUSDCBalance; 