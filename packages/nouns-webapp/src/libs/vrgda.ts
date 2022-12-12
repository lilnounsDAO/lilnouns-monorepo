import { useContractRead } from 'wagmi';
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
  const d = useContractRead({
    address: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
    abi: VRGDA_ABI,
    functionName: 'fetchNextNoun',
    chainId: 5,
  });

  console.log('d', d);

  const { data, error, isLoading } = d;

  return {
    data,
    error,
    isLoading,
  };
}
