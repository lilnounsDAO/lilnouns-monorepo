import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useWETHBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState<BigNumber | undefined>();

  const wethContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.weth) return;
    return new Contract(addresses.weth, erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!wethContract || !addresses.nounsDaoExecutor) return;
    wethContract.balanceOf(addresses.nounsDaoExecutor).then(setBalance);
  }, [wethContract]);

  return balance;
}

export default useWETHBalance; 