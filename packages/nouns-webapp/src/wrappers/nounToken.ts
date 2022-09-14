import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NounsTokenABI, NounsTokenFactory } from '@nouns/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { seedsQuery, lilnounsSeedsQuery } from './subgraph';

interface NounToken {
  name: string;
  description: string;
  image: string;
}

export interface INounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum NounsTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

const abi = new utils.Interface(NounsTokenABI);
const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nounsToken);
const bigNounSeedCacheKey = cacheKey(
  cache.bigNounSeed,
  CHAIN_ID,
  '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
);

const isSeedValid = (seed: Record<string, any> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

export const useNounToken = (nounId: EthersBN) => {
  const [noun] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'dataURI',
      args: [nounId],
    }) || [];

  if (!noun) {
    return;
  }

  const nounImgData = noun.split(';base64,').pop() as string;
  const json: NounToken = JSON.parse(atob(nounImgData));

  return json;
};

const seedArrayToObject = (seeds: (INounSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, INounSeed>>((acc, seed) => {
    acc[seed.id] = {
      background: Number(seed.background),
      body: Number(seed.body),
      accessory: Number(seed.accessory),
      head: Number(seed.head),
      glasses: Number(seed.glasses),
    };
    return acc;
  }, {});
};

const useNounSeeds = (nounId: EthersBN) => {
  // use nounId to get last 1000 from that point
  const res = Array.from(Array(nounId.toNumber()).keys())
    .map(x => x + 1)
    .sort((a, b) => b - a);

  const newArray = res
    .slice(0, 1000)
    .sort((a, b) => b - a)

  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  
  const { data } = useQuery(
    lilnounsSeedsQuery(newArray.map(String)),
    {
      skip: !!cachedSeeds,
    },
  );

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
    }
  }, [data, cachedSeeds]);

  return cachedSeeds;
};

const useBigNounSeeds = () => {
  const cache = localStorage.getItem(bigNounSeedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  const { data } = useQuery(seedsQuery(), {
    skip: !!cachedSeeds,
    context: { clientName: 'NounsDAO' },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      localStorage.setItem(bigNounSeedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
    }
  }, [data, cachedSeeds]);

  return cachedSeeds;
};

export const useNounSeed = (nounId: EthersBN) => {
  const seeds = useNounSeeds(nounId);
  const seed = seeds?.[nounId.toString()];
  // prettier-ignore
  const request = seed ? false : {
    abi,
    address: config.addresses.nounsToken,
    method: 'seeds',
    args: [nounId],
  };
  const response = useContractCall<INounSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: response.accessory,
          background: response.background,
          body: response.body,
          glasses: response.glasses,
          head: response.head,
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);

      //TODO: find way to cache all lils as query is set for first 1k
      console.log(`cached seed = ${JSON.stringify(cache.seed)}`);
    }
    return response;
  }
  return seed;
};

export const useBigNounSeed = (nounId: EthersBN) => {
  const seeds = useBigNounSeeds();
  const seed = seeds?.[nounId.toString()];
  // prettier-ignore
  const request = seed ? false : {
      abi,
      address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
      method: 'seeds',
      args: [nounId],
    };
  const response = useContractCall<INounSeed>(request);
  if (response) {
    const seedCache = localStorage.getItem(bigNounSeedCacheKey);
    if (seedCache && isSeedValid(response)) {
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: response.accessory,
          background: response.background,
          body: response.body,
          glasses: response.glasses,
          head: response.head,
        },
      });
      localStorage.setItem(bigNounSeedCacheKey, updatedSeedCache);
    }
    return response;
  }
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  return useAccountVotes(account ?? ethers.constants.AddressZero);
};

export const useAccountVotes = (account?: string): number | undefined => {
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'delegates',
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { account } = useEthers();

  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};

export const useDelegateVotes = () => {
  const nounsToken = new NounsTokenFactory().attach(config.addresses.nounsToken);

  const { send, state } = useContractFunction(nounsToken, 'delegate');

  return { send, state };
};

export const useNounTokenBalance = (address: string | undefined): number | undefined => {
  //  const { account } = useEthers();

  const [tokenBalance] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'balanceOf',
      args: [address],
    }) || [];

  return tokenBalance?.toNumber();
};


/**
 * 
 *       // console.log(`arrstring 3: data length == ${data?.seeds?.length}`);

      // const oldItems: Array<string> = JSON.parse(localStorage.getItem(seedCacheKey) || "") || [];
      // //JSON.parse(localStorage.getItem(seedCacheKey) || '');
      // console.log(`arrstring 3: oldItems lenght==${oldItems.length} == ${JSON.stringify(oldItems)}`);
      // // console.log(`arrstring 4: newItems lenght==${data.seeds.length} == ${JSON.stringify(data.seeds)}`);
      // // const mkmnfer = {"4793":{"background":0,"body":23,"accessory":125,"head":27,"glasses":11}}
      // oldItems.push("3");

      // localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)))

     

      // const stored = JSON.parse(localStorage.getItem(seedCacheKey) || "");
      // const student2 = JSON.stringify(seedArrayToObject(data.seeds))
      // stored.push(student2);

      //localStorage.setItem(localStorage.getItem(seedCacheKey) || "", JSON.stringify(stored));

      // var result = JSON.parse(localStorage.getItem('students'));
      // console.log(result);

 */