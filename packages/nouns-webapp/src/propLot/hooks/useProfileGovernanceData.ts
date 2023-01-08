import { formatSubgraphProposal } from '../../wrappers/nounsDao';
import { formatBigNounSubgraphProposal } from '../../wrappers/bigNounsDao';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  LIL_NOUNS_GOVERNANCE_BY_OWNER_SUB,
  SNAPSHOT_GOVERNANCE_BY_OWNER_SUB,
  BIG_NOUNS_PROPOSALS_SUB,
} from '../../wrappers/subgraph';
import { useBlockMeta, useBlockNumber } from '@usedapp/core';
import { useBlockTimestamp } from '../../hooks/useBlockTimestamp';

export enum TabFilterOptionValues {
  YES = 'Yes',
  NO = 'NO',
  ABSTAINED = 'ABSTAINED',
  SUBMITTED = 'SUBMITTED',
}

export const TabFilterOptions: any[] = [
  {
    label: 'Voted Yes',
    id: TabFilterOptionValues.YES,
  },
  {
    id: TabFilterOptionValues.NO,
    label: 'Voted No',
  },
  {
    id: TabFilterOptionValues.ABSTAINED,
    label: 'Abstained',
  },
  {
    id: TabFilterOptionValues.SUBMITTED,
    label: 'Submitted',
  },
];

const buildInitialCategorisedProposalState = () => {
  return Object.keys(TabFilterOptionValues).reduce((prev, curr) => {
    return {
      ...prev,
      [curr]: [],
    };
  }, {} as { [key in TabFilterOptionValues]: any[] });
};
const useProfileGovernanceData = () => {
  const { id } = useParams() as { id: string };
  const snapshotProposalVoteMap = useRef(
    {} as { [key: string]: { voted: number; reason: string } },
  );
  const blockNumber = useBlockNumber();
  const bigNounsTimestamp = useBlockTimestamp(blockNumber);
  const { timestamp } = useBlockMeta();

  const [
    getLilNounGovernanceHistory,
    { data: lilNounGovernanceHistory, loading: loadingLilNounsHistory },
  ] = useLazyQuery(LIL_NOUNS_GOVERNANCE_BY_OWNER_SUB, {
    context: {
      clientName: 'LilNouns',
    },
  });

  const [getBigNounProposalData, { data: bigNounProposalData, loading: loadingBigNounsHistory }] =
    useLazyQuery(BIG_NOUNS_PROPOSALS_SUB, {
      context: {
        clientName: 'NounsDAO',
      },
    });

  const [getNounsSnapshotHistory, { data: nounsSnapshotHistory, loading: loadingSnapshot }] =
    useLazyQuery(SNAPSHOT_GOVERNANCE_BY_OWNER_SUB, {
      context: {
        clientName: 'NounsDAOSnapshot',
      },
      onCompleted: data => {
        const snapshotProposalData =
          data?.votes.map((vote: any) => {
            return { choice: vote.choice, reason: vote.reason, body: vote.proposal.body };
          }) || [];
        const proposalUrlRegex = /nouns.wtf\/vote\/[[0-9]+/;

        const snapshotProposalIds = snapshotProposalData
          .map((proposal: any) => {
            const matchedUrl = proposal.body.match(proposalUrlRegex);
            if (Boolean(matchedUrl?.length)) {
              const proposalId = matchedUrl[0].match(/[0-9]+/);
              const choice: number = proposal.choice;
              snapshotProposalVoteMap.current[proposalId] = {
                voted: choice,
                reason: proposal.reason || '',
              };
              return proposalId[0];
            }
            return null;
          })
          .filter(Boolean);

        if (Boolean(snapshotProposalIds.length)) {
          getBigNounProposalData({
            variables: {
              ids: snapshotProposalIds,
            },
          });
        }
      },
    });

  useEffect(() => {
    getLilNounGovernanceHistory({
      variables: {
        id: id.toLowerCase(),
      },
    });

    getNounsSnapshotHistory({
      variables: {
        id: id.toLowerCase(),
      },
    });
  }, [id]);

  const snapshotProposalData = nounsSnapshotHistory?.votes.map((vote: any) => vote.proposal) || [];

  const lilNounProposals = useMemo(() => {
    return (
      lilNounGovernanceHistory?.votes.map((vote: any) => {
        const proposal = formatSubgraphProposal(vote.proposal, blockNumber, timestamp);
        return {
          type: 'LIL_NOUN',
          proposal,
          createdAt: proposal.createdBlock,
          voted: vote.supportDetailed,
          reason: vote.reason || '',
        };
      }) || []
    );
  }, [lilNounGovernanceHistory]);

  const bigNounProposals = useMemo(() => {
    return (
      bigNounProposalData?.proposals.map((p: any) => {
        const proposal = formatBigNounSubgraphProposal(p, blockNumber, bigNounsTimestamp);
        return {
          type: 'BIG_NOUN',
          proposal,
          createdAt: proposal.createdBlock,
          voted: snapshotProposalVoteMap.current[proposal.id]?.voted,
          reason: snapshotProposalVoteMap.current[proposal.id]?.reason,
        };
      }) || []
    );
  }, [bigNounProposalData, snapshotProposalVoteMap]);

  const categorisedProposals = useMemo(() => {
    return [...lilNounProposals, ...bigNounProposals].reduce((acc, curr) => {
      if (curr.voted === 1) {
        acc[TabFilterOptionValues.YES] = [...(acc[TabFilterOptionValues.YES] || []), curr];
      }

      if (curr.voted === 0) {
        acc[TabFilterOptionValues.NO] = [...(acc[TabFilterOptionValues.NO] || []), curr];
      }

      if (curr.voted === 2) {
        acc[TabFilterOptionValues.ABSTAINED] = [
          ...(acc[TabFilterOptionValues.ABSTAINED] || []),
          curr,
        ];
      }

      if (curr.proposal.proposer === id) {
        acc[TabFilterOptionValues.SUBMITTED] = [
          ...(acc[TabFilterOptionValues.SUBMITTED] || []),
          curr,
        ];
      }

      return acc;
    }, buildInitialCategorisedProposalState());
  }, [lilNounProposals, bigNounProposals]);

  return {
    isLoading: loadingLilNounsHistory || loadingSnapshot || loadingBigNounsHistory,
    lilNounProposals,
    bigNounProposals,
    snapshotProposalData,
    categorisedProposals,
  };
};

export default useProfileGovernanceData;
