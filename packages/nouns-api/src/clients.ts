import { config } from './config';
import { Contract, providers } from 'ethers';
import { NounsTokenABI } from '@nouns/contracts';

/**
 * Ethers JSON RPC Provider
 */
export const jsonRpcProvider = new providers.JsonRpcProvider(config.jsonRpcUrl);

/**
 * Nouns ERC721 Token Contract
 */
export const nounsTokenContract = new Contract(
  config.nounsTokenAddress,
  NounsTokenABI,
  jsonRpcProvider,
);
