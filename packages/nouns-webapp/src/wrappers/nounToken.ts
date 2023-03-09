import { useContractCall, useContractCalls, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NounsTokenABI, NounsTokenFactory } from '@lilnounsdao/contracts';
import config, { cache, cacheKey, CHAIN_ID } from '../config';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { seedsQuery, lilnounsSeedsQuery } from './subgraph';
import { PartialProposal, Proposal } from './nounsDao';

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
const seedExpriyCacheKey = cacheKey(cache.seedExpriy, CHAIN_ID, config.addresses.nounsToken);
const bigNounSeedCacheKey = cacheKey(
  cache.bigNounSeed,
  CHAIN_ID,
  config.bigNounsAddresses.nounsToken,
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

  const newArray = res.slice(0, 1000).sort((a, b) => b - a);

  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;

  const seedExpiryCache = localStorage.getItem(seedExpriyCacheKey);
  const cachedTTL = seedExpiryCache ? JSON.parse(seedExpiryCache) : undefined;

  const { data } = useQuery(lilnounsSeedsQuery(newArray.map(String)), {
    skip: !!cachedSeeds,
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      const newTTL = new Date().getTime() + 1000 * 60 * 60 * 2; //2 hours

      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
      // set seed cache ttl
      localStorage.setItem(seedExpriyCacheKey, JSON.stringify({ ttl: newTTL }));
    }

    // check if ttl has expired and reset stale cache accordingly
    if (cachedTTL) {
      const ttl = JSON.stringify(cachedTTL.ttl);
      const ttlTimestamp = Number(ttl);
      const now = new Date().getTime();

      if (now > ttlTimestamp) {
        localStorage.removeItem(seedCacheKey);
        localStorage.removeItem(seedExpriyCacheKey);
      }
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
    address: config.bigNounsAddresses.nounsToken,
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
      args: [account ?? "", block],
    }) || [];
  return votes?.toNumber();
};

export const useUserVotesAsOfBlockByProp = (proposals: PartialProposal[]) => {
  const { account } = useEthers();

  const snapshotBlocks = proposals.map(prop => prop.createdBlock);

  const votes = useContractCalls(
    snapshotBlocks.map(
      (block: number) =>
      ({
        abi: abi,
        address: config.addresses.nounsToken,
        method: 'getPriorVotes',
        args: [account, block],
      } || []),
    ),
  );

  const voteBalances = votes.flat().map(a => a?.toNumber() ?? 0);
  return voteBalances || [];
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
