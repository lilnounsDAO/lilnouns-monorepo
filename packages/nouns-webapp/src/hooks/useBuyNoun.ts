import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setAlertModal } from '../state/slices/application';
import { getVrgdaAuctionContract } from '../utils/vrgdaAuction';
import { useActiveAuction } from './useActiveAuction';

export function useBuyNoun() {
  const [nounId, setNounId] = useState(BigNumber.from(0));
  const activeAuction = useActiveAuction();
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const { library } = useEthers();

  const dispatch = useAppDispatch();

  const auctionContract: Contract = useMemo(() => {
    return getVrgdaAuctionContract(library);
  }, [library]);

  const { send, state } = useContractFunction(auctionContract, 'buyNow');

  async function buyNoun(blockNumber: number) {
    try {
      if (!activeAccount) throw new Error(`Please login`);

      if (!activeAuction) throw new Error(`Couldn't get data about active auction`);

      const { nounId, amount } = activeAuction;

      setNounId(nounId);

      console.debug('buyNow', { blockNumber, nounId, amount });

      send(blockNumber, nounId.toNumber(), { value: amount });
    } catch (e: any) {
      console.trace(e);
      dispatch(
        setAlertModal({
          title: 'Transaction error',
          message: e.message,
          show: true,
        }),
      );
    }
  }

  useEffect(() => {
    if (state.status === 'Success') {
      window.location.href = `/lilnoun/${nounId.toString()}`;
    }
  }, [state.status]);

  return {
    buyNoun,
    state,
    isLoading: ['Mining', 'PendingSignature', 'Success'].includes(state.status),
  };
}
