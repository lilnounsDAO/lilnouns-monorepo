import { ContractAddresses } from './types';
import addresses from './addresses.json';
import nounsAddresses from './nounsAddresses.json';

/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
export const getContractAddressesForChainOrThrow = (chainId: number): ContractAddresses => {
  const _addresses: Record<string, ContractAddresses> = addresses;
  if (!_addresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return _addresses[chainId];
};

export const getBigNounsContractAddressesForChainOrThrow = (
  chainId: number,
): Omit<ContractAddresses, 'lilVRGDA' | 'nounsSeederV2' | 'lilVRGDAProxy'> => {
  const _bigNounsAddresses: Record<
    string,
    Omit<ContractAddresses, 'lilVRGDA' | 'nounsSeederV2' | 'lilVRGDAProxy'>
  > = nounsAddresses;
  if (!_bigNounsAddresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return _bigNounsAddresses[chainId];
};
