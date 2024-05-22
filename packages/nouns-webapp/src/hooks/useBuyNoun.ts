import { Contract } from '@ethersproject/contracts';
import { useContractFunction, useEthers } from '@usedapp/core';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setAlertModal } from '../state/slices/application';
import { getVrgdaAuctionContract } from '../utils/vrgdaAuction';

export function useBuyNoun() {
  const [nounId, setNounId] = useState(0);
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
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

      const { amount, nounId } = activeAuction;
      setNounId(nounId);

      console.debug('buyNow call', { blockNumber, nounId });

      send(blockNumber, nounId, { value: amount });
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
      window.location.href = `/lilnoun/${nounId}`;
    }
  }, [state.status]);

  return {
    buyNoun,
    state,
    isLoading: ['Mining', 'PendingSignature', 'Success'].includes(state.status),
  };
}
