import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber, BigNumberish, Contract, ethers, utils } from 'ethers';
import { useEffect } from 'react';
import { INoun } from '../components/StandaloneNoun';
import config from '../config';
import LilVRGDAABI from '../libs/abi/LilVRGDA.json';

const FIRST_VRGDA_NOUN_ID = 7975;

const jsonProvider = new ethers.providers.JsonRpcProvider(config.app.jsonRpcUri);

export function getVrgdaAuctionContract(provider: Provider = jsonProvider): Contract {
  if (!config.addresses.lilVRGDAProxy) throw new Error('LilVRGDAProxy address not set');
  return new ethers.Contract(
    config.addresses.lilVRGDAProxy,
    new utils.Interface(LilVRGDAABI),
    provider,
  );
}

export async function getVrgdaAuctionConfig() {
  const contract = getVrgdaAuctionContract();

  try {
    const [reservePrice, targetPrice, updateInterval, poolSize] = await Promise.all([
      contract.reservePrice(),
      contract.targetPrice(),
      contract.updateInterval(),
      contract.poolSize(),
    ]);

    return {
      reservePrice: reservePrice as BigNumber,
      targetPrice: targetPrice as BigNumber,
      updateInterval: (updateInterval as BigNumber).toNumber(),
      poolSize: (poolSize as BigNumber).toNumber(),
    };
  } catch (error) {
    console.debug('Error in getVrgdaAuctionConfig() call', error);
  }
}

export async function getVrgdaAuctions(currentBlockNumber: number, poolSize: number) {
  const contract = getVrgdaAuctionContract();

  try {
    const [currentPrice, startTime, nextNoun, ...previousNouns] = await Promise.all([
      contract.getCurrentVRGDAPrice(),
      contract.startTime(),
      contract.fetchNextNoun(),
      ...Array.from({ length: poolSize - 1 }, (_, i) => {
        return contract.fetchNoun(currentBlockNumber - 1 - i);
      }),
    ]);

    return {
      currentPrice: currentPrice as BigNumber,
      nextNoun: normalizeVrgdaNoun({ ...nextNoun, blockNumber: currentBlockNumber }),
      previousNouns: previousNouns
        .map((noun, i) => ({ ...noun, blockNumber: currentBlockNumber - 1 - i }))
        .map(normalizeVrgdaNoun),
      startTime: startTime as BigNumber,
    };
  } catch (error) {
    console.debug('Error in getVrgdaAuctions() call', error);
  }
}

export const useBlockListener = (callback: (blockNumber: number) => Promise<void>) => {
  useEffect(() => {
    const handleBlock = (blockNumber: number) => {
      callback(blockNumber).catch(error => console.error('Error in block listener:', error));
    };

    jsonProvider.on('block', handleBlock);

    return () => {
      jsonProvider.off('block', handleBlock);
    };
  }, [callback]);
};

export function isVrgdaNoun(nounId: number) {
  return nounId >= FIRST_VRGDA_NOUN_ID;
}

function normalizeVrgdaNoun(noun: VrgdaNoun): INoun {
  const id = noun.nounId.toString();

  return {
    id,
    name: `Noun ${id}`,
    description: `Lil Noun ${id} is a member of the Lil Nouns DAO`,
    image: `data:image/svg+xml;base64,${noun.svg}`,
    svg: noun.svg,
    seed: {
      background: Number(noun.seed[0]),
      body: Number(noun.seed[1]),
      accessory: Number(noun.seed[2]),
      head: Number(noun.seed[3]),
      glasses: Number(noun.seed[4]),
    },
    blockNumber: noun.blockNumber,
  };
}

type VrgdaNoun = {
  nounId: BigNumber;
  seed: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber];
  svg: string;
  price: BigNumber;
  hash: BigNumberish;
  blockNumber: number;
};
