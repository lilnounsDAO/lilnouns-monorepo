import { config } from './config';
import { Contract, providers, getDefaultProvider } from 'ethers';
import { NounsTokenABI } from '@nouns/contracts';

/**
 * Ethers JSON RPC Provider
 */
export const jsonRpcProvider = new providers.JsonRpcProvider(config.jsonRpcUrl);
export const defaultProvider = getDefaultProvider(1, {
  infura: 'ad6e907edc6b43db82302cb69cf4acc3',
});

/**
 * Nouns ERC721 Token Contract
 */
export const nounsTokenContract = new Contract(
  config.nounsTokenAddress,
  NounsTokenABI,
  defaultProvider,
);
