import { useContractCall } from '@usedapp/core';
import { useState } from 'react';
import { VrgdaAuction } from '../wrappers/nounsAuction';
import VRGDA_ABI from './abi/vrgda.json';

export const vrgdaAuctionHouseContract = {
  addressOrName: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
  contractInterface: VRGDA_ABI,
};

const contracts = [
  {
    ...vrgdaAuctionHouseContract,
    functionName: 'updateInterval',
  },
  {
    ...vrgdaAuctionHouseContract,
    functionName: 'startTime',
  },
  {
    ...vrgdaAuctionHouseContract,
    functionName: 'fetchNextNoun',
  },
];

export default function useAuctionGetBlockchainDetails() {
  const d = useContractCall({
    address: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
    abi: VRGDA_ABI,
    method: 'fetchNextNoun',
    args: [],
  });

  console.log('d', d);

  return d;
}
