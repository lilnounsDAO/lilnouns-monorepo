import { Alert, Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
  const currentURLParams = useRef([] as string[]);

  /*
    Parse the query params from the url on page load and send them as filters in the initial
    PropLot query.
  */
  useEffect(() => {
    const urlParams = window.location.search;
    currentURLParams.current = urlParams
      .substring(1)
      .split('&')
      .filter(str => Boolean(str));
  }, []);

  const { loading, error, data, refetch } = useQuery<getPropLot>(GET_PROPLOT_QUERY, {
    context: {
      clientName: 'PropLot',
      headers: {
        'proplot-tz': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    },
    variables: {
      options: {
        requestUUID: uuid.current,
        filters: currentURLParams.current,
      },
    },
    client: propLotClient,
  });

  /*
    Filters that are applied to the current response.
    These can be parsed to update the local state after each request to ensure the client + API are in sync.
  */
  const appliedFilters = data?.propLot?.metadata?.appliedFilters || [];

  /*
    When we get a successful GraphQL response sync the metadata.appliedFilters from the response
    to the url. This enables users to share urls to filtered lists or save their state across
    page refreshes. metadata.appliedFilters is the source of truth for the state of the current filtered
    list.
  */
  useEffect(() => {
    const urlParams = appliedFilters.join('&');
    const currentURLParams = window.location.search;
    const currentRoute = window.location.pathname;

    if (urlParams && urlParams !== currentURLParams) {
      window.history.pushState('', '', `${currentRoute}?${urlParams}`);
    }
  }, [appliedFilters]);

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
      {!Boolean(data?.propLot?.ideas?.length) && (
        <Alert variant="secondary">
          <Alert.Heading>No ideas found.</Alert.Heading>
          <p>We couldn't find any ideas for this search!</p>
        </Alert>
      )}
    </div>
  );
};

export default PropLotHome;
