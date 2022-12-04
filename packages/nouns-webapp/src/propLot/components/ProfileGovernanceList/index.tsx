import { Spinner, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { ProposalState } from '../../../wrappers/nounsDao';
import { bigNounsPropStatus } from '../../../components/Proposals';
import { useState } from 'react';
import { TabOption, TabWrapper } from '../ProfileTabFilters';
import ProposalStatus from '../../../components/ProposalStatus';
import { TabFilterOptions, TabFilterOptionValues } from '../../hooks/useProfileGovernanceData';

import { createBreakpoint } from 'react-use';
import DropdownFilter from '../DropdownFilter';
import { FilterType as FilterTypeEnum } from '../../graphql/__generated__/globalTypes';

const useBreakpoint = createBreakpoint({ XL: 1440, L: 940, M: 650, S: 540 });

const sortFilter: any = {
  __typename: 'PropLotFilter',
  id: 'GovernanceFilter',
  type: FilterTypeEnum.SINGLE_SELECT,
  label: 'Filter',
  options: [
    {
      id: `ALL`,
      selected: false,
      value: 'ALL',
      label: 'All',
    },
    {
      id: `LIL_NOUNS`,
      selected: false,
      value: 'LIL_NOUN',
      label: 'Lil Nouns DAO',
    },
    {
      id: `NOUNS`,
      selected: false,
      value: 'BIG_NOUN',
      label: 'Nouns DAO',
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
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'S';
  const history = useHistory();
  const onClick = () => {
    type === 'LIL_NOUN' ? history.push(`/vote/${id}`) : history.push(`/vote/nounsdao/${id}`);
  };

  const mobileRow = (
    <div
      onClick={onClick}
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-[24px] pb-[24px] px-3"
    >
      <div className="font-propLot font-bold text-[18px] flex flex-row flex-1 justify-content-between align-items-start">
        <span className="flex flex-col sm:flex-row text-[#8C8D92] overflow-hidden gap-[8px]">
          <span className="flex flex-row gap-[8px] flex-1 justify-content-start align-items-start">
            <span>{id}</span>
            <span className="truncate">{type === 'LIL_NOUN' ? 'Lil Nouns DAO' : 'Nouns DAO'}</span>
          </span>
          <div className="flex flex-row flex-1 justify-content-start align-items-start">
            <span className="font-bold text-[18px] text-[#212529] flex flex-1">{title}</span>
          </div>
        </span>
        <div className="flex justify-self-end">
          <ProposalStatus status={status}></ProposalStatus>
        </div>
      </div>
      {children}
    </div>
  );

  const desktopRow = (
    <div
      onClick={onClick}
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-[24px] pb-[24px] px-3"
    >
      <div className="font-propLot font-bold text-[18px] flex flex-row flex-1 justify-content-start align-items-start">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 gap-[8px]">
            <span className="flex text-[#8C8D92] gap-[8px] overflow-hidden">
              <span>{id}</span>
              <span className="truncate">
                {type === 'LIL_NOUN' ? 'Lil Nouns DAO' : 'Nouns DAO'}
              </span>
            </span>
            <span className="text-[#212529] flex flex-1">{title}</span>
          </div>
        </div>
        <div className="flex justify-self-end">
          <ProposalStatus status={status}></ProposalStatus>
        </div>
      </div>
      {children}
    </div>
  );

  return isMobile ? mobileRow : desktopRow;
};

const filterProposals = (proposals: any[], currentFilter: string) =>
  proposals
    .filter(proposal => {
      if (currentFilter === 'ALL') {
        return true;
      }
      return proposal.type === currentFilter;
    })
    .sort((a: any, b: any) => b.createdAt - a.createdAt) || [];

const ProfileGovernanceList = ({
  isLoadingGovernance,
  snapshotProposalData,
  categorisedProposals,
}: {
  isLoadingGovernance: boolean;
  snapshotProposalData: any;
  categorisedProposals: { [key in TabFilterOptionValues]: any[] };
}) => {
  const [currentTab, setCurrentTab] = useState(TabFilterOptionValues.YES);
  const [currentFilter, setFilter] = useState('ALL');

  if (isLoadingGovernance) {
    return (
      <div className="flex flex-1 justify-center mt-[18px]">
        <Spinner animation="border" />
      </div>
    );
  }

  const sortedProposals = filterProposals(categorisedProposals[currentTab] || [], currentFilter);

  return (
    <>
      <div className="mt-[32px] mb-[24px] flex flex-col-reverse sm:flex-row">
        <div className="flex mb-[16px] sm:mt-0 mt-[16px] sm:mb-0">
          <TabWrapper>
            {TabFilterOptions.map(({ id, label }: { id: TabFilterOptionValues; label: string }) => {
              return (
                <TabOption
                  id={id}
                  isSelected={currentTab === id}
                  onClick={e => {
                    e.preventDefault();
                    setCurrentTab(id);
                  }}
                >{`${label} ${
                  categorisedProposals[id]?.filter(proposal => {
                    if (currentFilter === 'ALL') {
                      return true;
                    }
                    return proposal.type === currentFilter;
                  }).length || 0
                }`}</TabOption>
              );
            })}
          </TabWrapper>
        </div>
        <div className="flex flex-1 justify-end">
          <DropdownFilter
            filter={sortFilter}
            updateFilters={(filters: string[]) => {
              setFilter(filters[0]);
            }}
          />
        </div>
      </div>
      {sortedProposals?.map(p => {
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
