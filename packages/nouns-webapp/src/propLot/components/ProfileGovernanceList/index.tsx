import { Spinner, Alert } from 'react-bootstrap';

import { formatSubgraphProposal, ProposalState } from '../../../wrappers/nounsDao';
import { formatBigNounSubgraphProposal } from '../../../wrappers/bigNounsDao';
import { bigNounsPropStatus } from '../../../components/Proposals';
import classes from '../../../pages/Governance/Governance.module.css';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FilterType as FilterTyeEnum } from '../../graphql/__generated__/globalTypes';
import ProfileTabFilters, { GenericFilter } from '../ProfileTabFilters';
import ProposalStatus from '../../../components/ProposalStatus';
import {
  LIL_NOUNS_GOVERNANCE_BY_OWNER_SUB,
  SNAPSHOT_GOVERNANCE_BY_OWNER_SUB,
  BIG_NOUNS_PROPOSALS_SUB,
} from '../../../wrappers/subgraph';
import { useBlockMeta, useBlockNumber } from '@usedapp/core';
import { useBlockTimestamp } from '../../../hooks/useBlockTimestamp';

const filter: GenericFilter = {
  id: 'GOVERNANCE',
  type: FilterTyeEnum.SINGLE_SELECT,
  label: 'Tabs',
  options: [
    {
      id: 'YES',
      label: 'Voted Yes',
      selected: true,
      value: 'YES',
      icon: null,
    },
    {
      id: 'NO',
      label: 'Voted No',
      selected: false,
      value: 'NO',
      icon: null,
    },
    {
      id: 'ABSTAINED',
      label: 'Abstained',
      selected: false,
      value: 'ABSTAINED',
      icon: null,
    },
    {
      id: 'SUBMITTED',
      label: 'Submitted',
      selected: false,
      value: 'SUBMITTED',
      icon: null,
    },
  ],
};

const ProposalWrapper = ({
  id,
  title,
  status,
  type,
  children,
}: {
  id: number;
  title: string;
  status?: ProposalState;
  type: string;
  children: any;
}) => (
  <div className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-[24px] pb-[24px] px-3">
    <div className="font-propLot font-bold text-[18px] flex flex-row flex-1 justify-content-start align-items-start">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <span className="flex text-[#8C8D92] overflow-hidden">
            <span className="mr-4">{id}</span>
            <span className="truncate">{type === 'LIL_NOUN' ? 'Lil Nouns DAO' : 'Nouns DAO'}</span>
          </span>
          <span className="text-[#212529] flex flex-1 ml-6">{title}</span>
        </div>
      </div>
      <div className="flex justify-self-end">
        <ProposalStatus status={status}></ProposalStatus>
      </div>
    </div>
    {children}
  </div>
);

const ProfileGovernanceList = () => {
  const { id } = useParams() as { id: string };
  const snapshotProposalVoteMap = useRef(
    {} as { [key: string]: { voted: number; reason: string } },
  );
  const blockNumber = useBlockNumber();
  const bigNounsTimestamp = useBlockTimestamp(blockNumber);
  const { timestamp } = useBlockMeta();
  const [currentTab, setCurrentTab] = useState('YES');

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
        const snapshotProposalChoiceMap: { [key: string]: number } = {
          Against: 0,
          For: 1,
          Abstain: 2,
        };
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
              const choice: string = proposal.choice;
              snapshotProposalVoteMap.current[proposalId] = {
                voted: snapshotProposalChoiceMap[choice],
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

  if (loadingLilNounsHistory || loadingSnapshot || loadingBigNounsHistory) {
    return (
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  const proposals =
    lilNounGovernanceHistory?.votes.map((vote: any) => {
      const proposal = formatSubgraphProposal(vote.proposal, blockNumber, timestamp);
      return {
        type: 'LIL_NOUN',
        proposal,
        createdAt: proposal.createdBlock,
        voted: vote.supportDetailed,
        reason: vote.reason || '',
      };
    }) || [];

  const bigNounProposals =
    bigNounProposalData?.proposals.map((p: any) => {
      const proposal = formatBigNounSubgraphProposal(p, blockNumber, bigNounsTimestamp);
      console.log(snapshotProposalVoteMap.current);
      console.log(proposal.id);
      return {
        type: 'BIG_NOUN',
        proposal,
        createdAt: proposal.createdBlock,
        voted: snapshotProposalVoteMap.current[proposal.id]?.voted,
        reason: snapshotProposalVoteMap.current[proposal.id]?.reason,
      };
    }) || [];

  const sortedProposals = [...proposals, ...bigNounProposals]
    .filter(proposal => {
      if (currentTab === 'YES') {
        return proposal.voted === 1;
      }

      if (currentTab === 'NO') {
        return proposal.voted === 0;
      }

      if (currentTab === 'ABSTAIN') {
        return proposal.voted === 2;
      }

      if (currentTab === 'SUBMITTED') {
        return proposal.proposal.proposer === id;
      }

      return false;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleUpdateFilters = (updatedFilters: string[]) => {
    setCurrentTab(updatedFilters[0]);
  };

  return (
    <>
      <div className="mt-[32px] mb-[24px] flex flex-col-reverse sm:flex-row">
        <div className="flex mb-[16px] sm:mt-0 mt-[16px] sm:mb-0">
          <ProfileTabFilters filter={filter} updateFilters={handleUpdateFilters} />
        </div>
      </div>
      {sortedProposals.map(p => {
        if (p.type === 'LIL_NOUN') {
          return (
            <div className="mb-[16px] space-y-4" key={p.proposal.id}>
              <ProposalWrapper
                id={p.proposal.id}
                title={p.proposal.title}
                status={p.proposal.status}
                type={p.type}
                key={p.proposal.id}
              >
                <div className="flex flex-row flex-1 justify-content-start align-items-center pt-[12px] pt-[12px]">
                  <span className="font-propLot text-[16px] text-[#212529] border border-[#e2e3e8] bg-[#F4F4F8] p-4 rounded-lg flex-1">
                    {p.reason || 'No reason given'}
                  </span>
                </div>
              </ProposalWrapper>
            </div>
          );
        }

        if (p.type === 'BIG_NOUN') {
          const snapshotVoteObject = snapshotProposalData.find((spi: any) =>
            spi.body.includes(p.transactionHash),
          );
          const propStatus = bigNounsPropStatus(p.proposal, snapshotVoteObject);
          return (
            <div className="mb-[16px] space-y-4" key={p.proposal.id}>
              <ProposalWrapper
                id={p.proposal.id}
                title={p.proposal.title}
                status={propStatus}
                type={p.type}
                key={p.proposal.id}
              >
                <div className="flex flex-row flex-1 justify-content-start align-items-center pt-[12px] pt-[12px]">
                  <span className="font-propLot text-[16px] text-[#212529] border border-[#e2e3e8] bg-[#F4F4F8] p-4 rounded-lg flex-1">
                    {p.reason || 'No reason given'}
                  </span>
                </div>
              </ProposalWrapper>
            </div>
          );
        }

        return null;
      })}
      {!Boolean(sortedProposals.length) && (
        <Alert variant="secondary">
          <Alert.Heading>No data found.</Alert.Heading>
          <p>We couldn't find any data for this user!</p>
        </Alert>
      )}
    </>
  );
};
export default ProfileGovernanceList;
