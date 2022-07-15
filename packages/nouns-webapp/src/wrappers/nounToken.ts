import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, ethers, utils } from 'ethers';
import { NounsTokenABI, NounsTokenFactory } from '@nouns/contracts';
import config from '../config';

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

export const useNounSeed = (nounId: EthersBN) => {
  const seed = useContractCall<INounSeed>({
    abi,
    address: config.addresses.nounsToken,
    method: 'seeds',
    args: [nounId],
  });
  return seed;
};

export const useBigNounSeed = (nounId: EthersBN) => {
  const seed = useContractCall<INounSeed>({
    abi,
    address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    method: 'seeds',
    args: [nounId],
  });
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