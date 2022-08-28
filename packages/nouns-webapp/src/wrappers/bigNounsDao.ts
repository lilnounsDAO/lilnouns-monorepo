import { NounsDAOABI, NounsDaoLogicV1Factory } from '@nouns/sdk';
import { useContractCall, useContractCalls, useContractFunction, useEthers } from '@usedapp/core';
import { utils, BigNumber as EthersBN } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import * as R from 'ramda';
import { ProposalData, ProposalCallResult, ProposalState, Proposal } from './nounsDao';

const abi = new utils.Interface(NounsDAOABI);
const nounsDaoContract = new NounsDaoLogicV1Factory().attach("0x6f3E6272A167e8AcCb32072d08E0957F9c79223d");
const proposalCreatedFilter = nounsDaoContract.filters?.ProposalCreated(
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
);

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

const useFormattedProposalCreatedLogs = () => {
  const useLogsResult = useLogs(proposalCreatedFilter);

  return useMemo(() => {
    return useLogsResult?.logs?.map(log => {
      const { args: parsed } = abi.parseLog(log);
      return {
        description: parsed.description,
        transactionHash: log.transactionHash,
        details: parsed.targets.map((target: string, i: number) => {
          const signature = parsed.signatures[i];
          const value = parsed[3][i];
          const [name, types] = signature.substr(0, signature.length - 1)?.split('(');
          if (!name || !types) {
            return {
              target,
              functionSig: name === '' ? 'transfer' : name === undefined ? 'unknown' : name,
              callData: types ? types : value ? `${utils.formatEther(value)} ETH` : '',
            };
          }
          const calldata = parsed.calldatas[i];
          const decoded = defaultAbiCoder.decode(types.split(','), calldata);
          return {
            target,
            functionSig: name,
            callData: decoded.join(),
            value: value.gt(0) ? `{ value: ${utils.formatEther(value)} ETH }` : '',
          };
        }),
      };
    });
  }, [useLogsResult]);
};


export const useAllBigNounProposals = (): ProposalData => {
  const proposalCount = useBigNounProposalCount();
  const votingDelay = useVotingDelay(nounsDaoContract.address);

  const govProposalIndexes = useMemo(() => {
    return countToIndices(proposalCount);
  }, [proposalCount]);

  const bigNounProposals = useContractCalls<ProposalCallResult>(
    govProposalIndexes.map(index => ({
      abi,
      address: nounsDaoContract.address,
      method: 'proposals',
      args: [index],
    })),
  );

  const proposalStates = useContractCalls<[ProposalState]>(
    govProposalIndexes.map(index => ({
      abi,
      address: nounsDaoContract.address,
      method: 'state',
      args: [index],
    })),
  );

  const formattedLogs = useFormattedProposalCreatedLogs();

  // Early return until events are fetched
  return useMemo(() => {
    const logs = formattedLogs ?? [];
    if (bigNounProposals.length && !logs.length) {
      return { data: [], loading: true };
    }

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


    return {
      data: bigNounProposals.map((proposal, i) => {
        const description = logs[i]?.description?.replace(/\\n/g, '\n');
        const status = proposalStates[i]?.[0] ?? ProposalState.UNDETERMINED;

        return {
          id: proposal?.id.toString(),
          title: R.pipe(extractTitle, removeMarkdownStyle)(description) ?? 'Untitled',
          description: description ?? 'No description.',
          proposer: proposal?.proposer,
          status: status,
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
          transactionHash: logs[i]?.transactionHash
        };

      }),
      loading: false,
    };
  }, [formattedLogs, proposalStates, bigNounProposals, votingDelay]);
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
