import { NounsDAOABI, NounsDaoLogicV1Factory } from '@nouns/sdk';
import {
  ChainId,
  useBlockMeta,
  useBlockNumber,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder, Result } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import * as R from 'ramda';
import {
  ProposalData,
  ProposalCallResult,
  ProposalState,
  Proposal,
  ProposalSubgraphEntity,
  ProposalTransactionDetails,
} from './nounsDao';
import { CHAIN_ID } from '../config';
import { bigNounsProposalsQuery } from './subgraph';
import BigNumber from 'bignumber.js';
import { useQuery } from '@apollo/client';

const abi = new utils.Interface(NounsDAOABI);
const nounsDaoContract = new NounsDaoLogicV1Factory().attach(
  '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
);

// Start the log search at the mainnet deployment block to speed up log queries
const fromBlock = CHAIN_ID === ChainId.Mainnet ? 12985453 : 0;
const proposalCreatedFilter = {
  ...nounsDaoContract.filters?.ProposalCreated(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ),
  fromBlock,
};

const hashRegex = /^\s*#{1,6}\s+([^\n]+)/;
const equalTitleRegex = /^\s*([^\n]+)\n(={3,25}|-{3,25})/;

/**
 * Extract a markdown title from a proposal body that uses the `# Title` format
 * Returns null if no title found.
 */
const extractHashTitle = (body: string) => body.match(hashRegex);
/**
 * Extract a markdown title from a proposal body that uses the `Title\n===` format.
 * Returns null if no title found.
 */
const extractEqualTitle = (body: string) => body.match(equalTitleRegex);

/**
 * Extract title from a proposal's body/description. Returns null if no title found in the first line.
 * @param body proposal body
 */
const extractTitle = (body: string | undefined): string | null => {
  if (!body) return null;
  const hashResult = extractHashTitle(body);
  const equalResult = extractEqualTitle(body);
  return hashResult ? hashResult[1] : equalResult ? equalResult[1] : null;
};

const removeBold = (text: string | null): string | null =>
  text ? text.replace(/\*\*/g, '') : text;
const removeItalics = (text: string | null): string | null =>
  text ? text.replace(/__/g, '') : text;

const removeMarkdownStyle = R.compose(removeBold, removeItalics);

export const useHasVotedOnBigNounProposal = (proposalId: string | undefined): boolean => {
  const { account } = useEthers();

  // Fetch a voting receipt for the passed proposal id
  const [receipt] =
    useContractCall<[any]>({
      abi,
      address: nounsDaoContract.address,
      method: 'getReceipt',
      args: [proposalId, account],
    }) || [];
  return receipt?.hasVoted ?? false;
};

export const useBigNounProposalVote = (proposalId: string | undefined): string => {
  const { account } = useEthers();

  // Fetch a voting receipt for the passed proposal id
  const [receipt] =
    useContractCall<[any]>({
      abi,
      address: nounsDaoContract.address,
      method: 'getReceipt',
      args: [proposalId, account],
    }) || [];
  const voteStatus = receipt?.support ?? -1;
  if (voteStatus === 0) {
    return 'Against';
  }
  if (voteStatus === 1) {
    return 'For';
  }
  if (voteStatus === 2) {
    return 'Abstain';
  }

  return '';
};

export const useBigNounProposalCount = (): number | undefined => {
  const [count] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'proposalCount',
      args: [],
    }) || [];
  return count?.toNumber();
};

export const useBigNounProposalThreshold = (): number | undefined => {
  const [count] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDaoContract.address,
      method: 'proposalThreshold',
      args: [],
    }) || [];
  return count?.toNumber();
};

const useVotingDelay = (nounsDao: string): number | undefined => {
  const [blockDelay] =
    useContractCall<[EthersBN]>({
      abi,
      address: nounsDao,
      method: 'votingDelay',
      args: [],
    }) || [];
  return blockDelay?.toNumber();
};

const countToIndices = (count: number | undefined) => {
  return typeof count === 'number' ? new Array(count).fill(0).map((_, i) => [i + 1]) : [];
};

const formatProposalTransactionDetails = (details: ProposalTransactionDetails | Result) => {
  return details.targets.map((target: string, i: number) => {
    const signature = details.signatures[i];
    const value = EthersBN.from(
      // Handle both logs and subgraph responses
      (details as ProposalTransactionDetails).values?.[i] ?? (details as Result)?.[3]?.[i] ?? 0,
    );
    const [name, types] = signature.substring(0, signature.length - 1)?.split('(');
    if (!name || !types) {
      return {
        target,
        functionSig: name === '' ? 'transfer' : name === undefined ? 'unknown' : name,
        callData: types ? types : value ? `${utils.formatEther(value)} ETH` : '',
      };
    }
    const calldata = details.calldatas[i];
    const decoded = defaultAbiCoder.decode(types.split(','), calldata);
    return {
      target,
      functionSig: name,
      callData: decoded.join(),
      value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH }` : '',
    };
  });
};

const useFormattedProposalCreatedLogs = (skip: boolean, fromBlock?: number) => {
  const filter = useMemo(
    () => ({
      ...proposalCreatedFilter,
      ...(fromBlock ? { fromBlock } : {}),
    }),
    [fromBlock],
  );
  const useLogsResult = useLogs(!skip ? filter : undefined);

  return useMemo(() => {
    return useLogsResult?.logs?.map(log => {
      const { args: parsed } = abi.parseLog(log);
      return {
        description: parsed.description,
        transactionHash: log.transactionHash,
        details: formatProposalTransactionDetails(parsed),
      };
    });
  }, [useLogsResult]);
};

const getProposalState = (
  blockNumber: number | undefined,
  blockTimestamp: Date | undefined,
  proposal: ProposalSubgraphEntity,
) => {
  const status = ProposalState[proposal.status];
  if (status === ProposalState.PENDING) {
    if (!blockNumber) {
      return ProposalState.UNDETERMINED;
    }
    if (blockNumber <= parseInt(proposal.startBlock)) {
      return ProposalState.PENDING;
    }
    return ProposalState.ACTIVE;
  }
  if (status === ProposalState.ACTIVE) {
    if (!blockNumber) {
      return ProposalState.UNDETERMINED;
    }
    if (blockNumber > parseInt(proposal.endBlock)) {
      const forVotes = new BigNumber(proposal.forVotes);
      if (forVotes.lte(proposal.againstVotes) || forVotes.lt(proposal.quorumVotes)) {
        return ProposalState.DEFEATED;
      }
      if (!proposal.executionETA) {
        return ProposalState.SUCCEEDED;
      }
    }
    return status;
  }
  if (status === ProposalState.QUEUED) {
    if (!blockTimestamp || !proposal.executionETA) {
      return ProposalState.UNDETERMINED;
    }
    const GRACE_PERIOD = 14 * 60 * 60 * 24;
    if (blockTimestamp.getTime() / 1_000 >= parseInt(proposal.executionETA) + GRACE_PERIOD) {
      return ProposalState.EXPIRED;
    }
    return status;
  }
  return status;
};

export const useAllBigNounProposalsViaSubgraph = (): ProposalData => {
  const { loading, data, error } = useQuery(bigNounsProposalsQuery(), {
    context: { clientName: 'NounsDAO' },
    fetchPolicy: 'no-cache',
  });

  const blockNumber = useBlockNumber();
  const { timestamp } = useBlockMeta();

  const proposals = data?.proposals?.map((proposal: ProposalSubgraphEntity) => {
    const description = proposal.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, '');
    return {
      id: proposal.id,
      title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
      description: description ?? 'No description.',
      proposer: proposal.proposer.id,
      status: getProposalState(blockNumber, timestamp, proposal),
      proposalThreshold: parseInt(proposal.proposalThreshold),
      quorumVotes: parseInt(proposal.quorumVotes),
      forCount: parseInt(proposal.forVotes),
      againstCount: parseInt(proposal.againstVotes),
      abstainCount: parseInt(proposal.abstainVotes),
      createdBlock: parseInt(proposal.createdBlock),
      startBlock: parseInt(proposal.startBlock),
      endBlock: parseInt(proposal.endBlock),
      eta: proposal.executionETA ? new Date(Number(proposal.executionETA) * 1000) : undefined,
      details: formatProposalTransactionDetails(proposal),
      transactionHash: proposal.createdTransactionHash,
    };
  });

  return {
    loading,
    error,
    data: proposals ?? [],
  };
};

export const useAllBigNounProposalsViaChain = (skip = false): ProposalData => {
  const proposalCount = useBigNounProposalCount();
  const votingDelay = useVotingDelay(nounsDaoContract.address);

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount);
  }, [proposalCount]);

  const requests = (method: string) => {
    if (skip) return [false];
    return govProposalIndexes.map(index => ({
      abi,
      method,
      address: nounsDaoContract.address,
      args: [index],
    }));
  };

  const proposals = useContractCalls<ProposalCallResult>(requests('proposals'));
  const proposalStates = useContractCalls<[ProposalState]>(requests('state'));

  const formattedLogs = useFormattedProposalCreatedLogs(skip);

  // Early return until events are fetched
  return useMemo(() => {
    const logs = formattedLogs ?? [];
    if (proposals.length && !logs.length) {
      return { data: [], loading: true };
    }

    return {
      data: proposals.map((proposal, i) => {
        const description = logs[i]?.description?.replace(/\\n/g, '\n').replace(/(^['"]|['"]$)/g, '');
        return {
          id: proposal?.id.toString(),
          title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
          description: description ?? 'No description.',
          proposer: proposal?.proposer,
          status: proposalStates[i]?.[0] ?? ProposalState.UNDETERMINED,
          proposalThreshold: parseInt(proposal?.proposalThreshold?.toString() ?? '0'),
          quorumVotes: parseInt(proposal?.quorumVotes?.toString() ?? '0'),
          forCount: parseInt(proposal?.forVotes?.toString() ?? '0'),
          againstCount: parseInt(proposal?.againstVotes?.toString() ?? '0'),
          abstainCount: parseInt(proposal?.abstainVotes?.toString() ?? '0'),
          createdBlock: parseInt(proposal?.startBlock.sub(votingDelay ?? 0)?.toString() ?? ''),
          startBlock: parseInt(proposal?.startBlock?.toString() ?? ''),
          endBlock: parseInt(proposal?.endBlock?.toString() ?? ''),
          eta: proposal?.eta ? new Date(proposal?.eta?.toNumber() * 1000) : undefined,
          details: logs[i]?.details,
          transactionHash: logs[i]?.transactionHash,
        };
      }),
      loading: false,
    };
  }, [formattedLogs, proposalStates, proposals, votingDelay]);
};

export const useAllBigNounProposals = (): ProposalData => {
  const subgraph = useAllBigNounProposalsViaSubgraph();
  const onchain = useAllBigNounProposalsViaChain(!subgraph.error);
  // return subgraph?.error ? onchain : subgraph;

  const onchains = useAllBigNounProposalsViaChain(false);
  return onchains;
};

export const useBigNounProposal = (id: string | number): Proposal | undefined => {
  const { data } = useAllBigNounProposals();
  return data?.find(p => p.id === id.toString());
};

export const useCastBigNounVote = () => {
  const { send: castVote, state: castVoteState } = useContractFunction(
    nounsDaoContract,
    'castVote',
  );
  return { castVote, castVoteState };
};

export const useCastBigNounVoteWithReason = () => {
  const { send: castVoteWithReason, state: castVoteWithReasonState } = useContractFunction(
    nounsDaoContract,
    'castVoteWithReason',
  );
  return { castVoteWithReason, castVoteWithReasonState };
};

export const useBigNounPropose = () => {
  const { send: propose, state: proposeState } = useContractFunction(nounsDaoContract, 'propose');
  return { propose, proposeState };
};

export const useQueueBigNounProposal = () => {
  const { send: queueProposal, state: queueProposalState } = useContractFunction(
    nounsDaoContract,
    'queue',
  );
  return { queueProposal, queueProposalState };
};

export const useExecuteBigNounProposal = () => {
  const { send: executeProposal, state: executeProposalState } = useContractFunction(
    nounsDaoContract,
    'execute',
  );
  return { executeProposal, executeProposalState };
};
