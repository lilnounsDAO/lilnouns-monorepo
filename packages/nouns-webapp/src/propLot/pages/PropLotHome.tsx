import { Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import { useRef } from 'react';
import { useAccountVotes } from '../../wrappers/nounToken';
import { useIdeas } from '../../hooks/useIdeas';
import { useQuery } from '@apollo/client';
import propLotClient from '../graphql/config';
import { GET_PROPLOT_QUERY } from '../graphql/propLotQuery';
import { v4 } from 'uuid';

import { getPropLot } from '../graphql/__generated__/getPropLot';

import UIFilter from '../components/DropdownFilter';
import IdeaRow from '../components/IdeaRow';

const PropLotHome = () => {
  const { account } = useEthers();
  const history = useHistory();
  const { voteOnIdeaList } = useIdeas();
  const uuid = useRef(v4());

  const { loading, error, data, refetch } = useQuery<getPropLot>(GET_PROPLOT_QUERY, {
    context: { clientName: 'PropLot' },
    variables: {
      options: {
        requestUUID: uuid.current,
        filters: [] as string[],
      },
    },
    client: propLotClient,
  });

  /*
    Filters that are applied to the current response.
    These can be parsed to update the local state after each request to ensure the client + API are in sync.
  */
  const appliedFilters = data?.propLot?.metadata?.appliedFilters || [];

  const handleUpdateFilters = (updatedFilters: string[], filterId: string) => {
    /*
      Keep previously applied filters, remove any that match the filterId value.
      Then add the selection of updatedFilters and remove the __typename property.
    */
    const selectedfilters: string[] = [
      ...appliedFilters.filter((f: string) => {
        return !f.includes(`${filterId}=`);
      }),
      ...updatedFilters,
    ];

    refetch({ options: { requestUUID: v4(), filters: selectedfilters } });
  };

  const nounBalance = useAccountVotes(account || undefined) ?? 0;

  const nullStateCopy = () => {
    if (Boolean(account)) {
      return 'You have no Lil Nouns.';
    }
    return 'Connect wallet to submit an idea.';
  };

  const hasNouns = nounBalance > 0;

  return (
    <div>
      <div>
        <div className="flex mb-4 justify-between items-center text-right pt-2">
          <h3 className="text-4xl lodrina">Ideas</h3>
          {account !== undefined && hasNouns ? (
            <Button
              className="rounded-lg !bg-[#2B83F6] !text-white !font-bold p-2"
              onClick={() => history.push('/ideas/create')}
            >
              Submit Idea
            </Button>
          ) : (
            <>
              <div className="flex justify-end">
                <Button className="!text-[#8C8D92] !bg-[#F4F4F8] !border-[#E2E3E8] !font-bold p-2">
                  Submit Idea
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {(!Boolean(account) || !hasNouns) && (
        <div className="mt-2 text-[#8C8D92]">{nullStateCopy()}</div>
      )}

      <div className="mt-2 mb-2 flex flex-col">
        <div className="flex">
          {data?.propLot?.sortFilter && (
            <UIFilter filter={data.propLot.sortFilter} updateFilters={handleUpdateFilters} />
          )}
          {data?.propLot?.tagFilter && (
            <UIFilter filter={data.propLot.tagFilter} updateFilters={handleUpdateFilters} />
          )}
          {data?.propLot?.dateFilter && (
            <UIFilter filter={data.propLot.dateFilter} updateFilters={handleUpdateFilters} />
          )}
        </div>
      </div>

      {data?.propLot?.ideas?.map(idea => {
        return (
          <div className="mt-2 mb-2 space-y-4">
            <IdeaRow
              idea={idea}
              key={`idea-${idea.id}`}
              voteOnIdea={voteOnIdeaList}
              nounBalance={nounBalance}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PropLotHome;
