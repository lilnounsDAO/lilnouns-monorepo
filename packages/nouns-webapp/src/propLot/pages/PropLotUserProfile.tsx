import { Col, Row, Button } from 'react-bootstrap';
import Section from '../../layout/Section';
import { v4 } from 'uuid';
import { Alert } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { BigNumber as EthersBN } from 'ethers';
import { useParams } from 'react-router-dom';

import Davatar from '@davatar/react';

import { useEffect, useState } from 'react';
import { useAccountVotes, useNounTokenBalance } from '../../wrappers/nounToken';
import { useAuth } from '../../hooks/useAuth';
import { useLazyQuery } from '@apollo/client';
import propLotClient from '../graphql/config';
import { GET_PROPLOT_PROFILE_QUERY } from '../graphql/propLotProfileQuery';
import ProfileTabFilters from '../components/ProfileTabFilters';
import IdeaRow from '../components/IdeaRow';
import {
  getPropLotProfile,
  getPropLotProfile_propLotProfile_profile_user_userStats as UserStats,
} from '../graphql/__generated__/getPropLotProfile';
import DropdownFilter from '../components/DropdownFilter';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import useSyncURLParams from '../utils/useSyncUrlParams';
import { StandaloneNounCircular } from '../../components/StandaloneNoun';
import { GrayCircle } from '../../components/GrayCircle';
import { NOUNS_BY_OWNER_SUB } from '../../wrappers/subgraph';
import ProfileCommentRow from '../components/ProfileCommentRow';
import ProfileGovernanceList from '../components/ProfileGovernanceList';

const ProfileCard = (props: { title: string; count: number }) => {
  return (
    <div className="font-propLot whitespace-nowrap py-[8px] px-[16px] gap-[4px] sm:p-[16px] sm:gap-[8px] bg-white border-solid border border-[#e2e3e8] rounded-[16px] box-border flex flex-1 flex-col justify-start">
      <span className="font-semibold text-[12px] text-[#8C8D92]">{props.title}</span>
      <span className="font-extrabold text-[24px] text-[#212529]">{props.count}</span>
    </div>
  );
};

const ProfileLilNounDisplay = ({
  nounBalanceWithDelegates,
  nounWalletBalance,
}: {
  nounBalanceWithDelegates: number;
  nounWalletBalance: number;
}) => {
  const { id } = useParams() as { id: string };
  const { library: provider } = useEthers();

  const [getNounsByOwnerQuerySub, { data: getNounsByOwnerDataSub }] = useLazyQuery(
    NOUNS_BY_OWNER_SUB,
    {
      context: {
        clientName: 'LilNouns',
      },
    },
  );

  useEffect(() => {
    getNounsByOwnerQuerySub({
      variables: {
        id: id.toLowerCase(),
      },
    });
  }, [id]);

  const lilNounData = getNounsByOwnerDataSub?.account?.nouns || [];

  return (
    <div className="flex flex-col justify-end gap-[16px]">
      {Boolean(lilNounData?.length) ? (
        <div className="flex flex-1 flex-row-reverse gap-[4px] justify-center sm:justify-start">
          <>
            {lilNounData
              .map((lilNoun: any) => {
                return (
                  <StandaloneNounCircular
                    key={lilNoun.id}
                    nounId={EthersBN.from(lilNoun.id)}
                    styleOverride="!w-[48px] !h-[48px]"
                  />
                );
              })
              .slice(0, 5)}
            {lilNounData.length > 5 && (
              <GrayCircle
                styleOverride="!w-[48px] !h-[48px]"
                renderOverlay={() => {
                  return (
                    <span className="flex flex-1 mb-[-48px] text-[12px] h-full font-propLot font-semibold z-10 !text-[#212529] items-center justify-center">{`+${
                      lilNounData.length - 5
                    }`}</span>
                  );
                }}
              />
            )}
          </>
        </div>
      ) : (
        <Davatar size={32} address={id} provider={provider} />
      )}
      <div className="flex flex-1 text-[12px] text-[#8C8D92] font-semibold whitespace-pre justify-center">
        Lil nouns owned:<span className="text-[#212529]"> {nounWalletBalance}</span>
        {` delegated:`}
        <span className="text-[#212529]">{` ${nounBalanceWithDelegates - nounWalletBalance}`}</span>
      </div>
    </div>
  );
};

const PropLotUserProfile = () => {
  const { id } = useParams() as { id: string };
  const { account } = useEthers();
  const { getAuthHeader } = useAuth();

  const [getPropLotProfileQuery, { data, refetch }] = useLazyQuery<getPropLotProfile>(
    GET_PROPLOT_PROFILE_QUERY,
    {
      context: {
        clientName: 'PropLot',
        headers: {
          ...getAuthHeader(),
          'proplot-tz': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      client: propLotClient,
    },
  );

  // REVIST LATER WHEN ADDING ONCHAIN DATA AND PROFILE IMAGES
  // const [getNounsByOwnerQuery, { data: getNounsByOwnerData }] = useLazyQuery(NOUNS_BY_OWNER_ZORA, {
  //   context: {
  //     clientName: 'ZoraAPI',
  //   },
  //   client: zoraClient,
  // });

  /*
    Parse the query params from the url on page load and send them as filters in the initial
    PropLot query.
  */
  useEffect(() => {
    const urlParams = window.location.search;
    const currentURLParams = urlParams
      .substring(1)
      .split('&')
      .filter(str => Boolean(str));

    getPropLotProfileQuery({
      variables: {
        options: {
          wallet: id,
          requestUUID: v4(),
          filters: currentURLParams,
        },
      },
    });
  }, [id]);

  /*
    Filters that are applied to the current response.
    These can be parsed to update the local state after each request to ensure the client + API are in sync.
  */
  const appliedFilters = data?.propLotProfile?.metadata?.appliedFilters || [];
  useSyncURLParams(appliedFilters);

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

    refetch({ options: { wallet: id, requestUUID: v4(), filters: selectedfilters } });
  };

  const [listButtonActive, setListButtonActive] = useState('PROP_LOT');

  const lists: { [key: string]: any } = {
    PROP_LOT: {
      title: 'Prop Lot',
    },
    GOVERNANCE: {
      title: 'Governance',
    },
  };

  const nounBalanceWithDelegates = useAccountVotes(id || undefined) ?? 0;
  const nounWalletBalance = useNounTokenBalance(id ?? '') ?? 0;

  const isAccountOwner = account !== undefined && account === id;

  const ens = useReverseENSLookUp(id);
  const shortAddress = useShortAddress(id);

  const buildProfileCards = (userStats: UserStats) => {
    return (
      <>
        <ProfileCard count={userStats.totalIdeas || 0} title={'Prop Lot submissions'} />
        <ProfileCard count={userStats.upvotesReceived || 0} title={'Upvotes received'} />
        <ProfileCard count={userStats.downvotesReceived || 0} title={'Downvotes received'} />
        <ProfileCard count={userStats.netVotesReceived || 0} title={'Net votes'} />
      </>
    );
  };

  return (
    <Section fullWidth={false} className="ml-[16px] mr-[16px]">
      <Col lg={10} className="ml-auto mr-auto">
        <Row>
          <div>
            <span className="text-[#8C8D92] flex flex-row items-center justify-center sm:justify-start">
              <span className="text-[24px] font-londrina">Profile</span>
            </span>
          </div>
          <div className="flex flex-col mb-[48px]">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-row justify-end">
                <h1 className="font-londrina text-[48px] sm:text-[56px] text-[#212529] font-normal">
                  {ens || shortAddress}
                </h1>
              </div>
              <ProfileLilNounDisplay
                nounBalanceWithDelegates={nounBalanceWithDelegates}
                nounWalletBalance={nounWalletBalance}
              />
            </div>
          </div>
        </Row>
        <div className="font-propLot">
          <div className="grid gap-[16px] grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4">
            {data?.propLotProfile?.profile.user.userStats &&
              buildProfileCards(data?.propLotProfile?.profile.user.userStats)}
          </div>

          {listButtonActive === 'GOVERNANCE' && (
            <>
              <div className="mt-[48px] sm:mt-[81px] flex flex-1 items-center flex-col-reverse gap-[16px] sm:gap-[8px] sm:flex-row">
                <h2 className="font-londrina text-[38px] text-[#212529] font-normal flex flex-1">
                  Governance activity
                </h2>
                <div
                  className="flex flex-wrap justify-center !gap-[8px]"
                  role="btn-toolbar"
                  aria-label="Basic example"
                >
                  {Object.keys(lists).map(list => {
                    return (
                      <Button
                        key={list}
                        className={`!border-box !flex !flex-row justify-center items-center !py-[8px] !px-[12px] !bg-white !border !rounded-[100px] ${
                          listButtonActive === list
                            ? '!text-[#212529] !border-[#2B83F6] !border-[2px]'
                            : '!text-[#8C8D92] !border-[#E2E3E8] !border-[1px]'
                        } !text-[16px] !font-semibold`}
                        id={list}
                        onClick={e => setListButtonActive(list)}
                      >
                        {lists[list].title}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <ProfileGovernanceList />
            </>
          )}

          {listButtonActive === 'PROP_LOT' && (
            <>
              <div className="mt-[48px] sm:mt-[81px] flex flex-1 items-center flex-col-reverse gap-[16px] sm:gap-[8px] sm:flex-row">
                <h2 className="font-londrina text-[38px] text-[#212529] font-normal flex flex-1">
                  Prop Lot activity
                </h2>

                <div
                  className="flex flex-wrap justify-center !gap-[8px]"
                  role="btn-toolbar"
                  aria-label="Basic example"
                >
                  {Object.keys(lists).map(list => {
                    return (
                      <Button
                        key={list}
                        className={`!border-box !flex !flex-row justify-center items-center !py-[8px] !px-[12px] !bg-white !border !rounded-[100px] ${
                          listButtonActive === list
                            ? '!text-[#212529] !border-[#2B83F6] !border-[2px]'
                            : '!text-[#8C8D92] !border-[#E2E3E8] !border-[1px]'
                        } !text-[16px] !font-semibold`}
                        id={list}
                        onClick={e => setListButtonActive(list)}
                      >
                        {lists[list].title}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-[32px] mb-[24px] flex flex-col-reverse sm:flex-row">
                <div className="flex mb-[16px] sm:mt-0 mt-[16px] sm:mb-0">
                  {data?.propLotProfile?.tabFilter && (
                    <ProfileTabFilters
                      filter={data.propLotProfile.tabFilter}
                      updateFilters={handleUpdateFilters}
                    />
                  )}
                </div>
                <div className="flex flex-1 justify-end">
                  {data?.propLotProfile?.sortFilter && (
                    <DropdownFilter
                      filter={data.propLotProfile.sortFilter}
                      updateFilters={handleUpdateFilters}
                    />
                  )}
                </div>
              </div>

              {data?.propLotProfile?.list?.map(listItem => {
                if (listItem.__typename === 'Idea') {
                  return (
                    <div className="mb-[16px] space-y-4">
                      <IdeaRow
                        idea={listItem}
                        key={`idea-${listItem.id}`}
                        nounBalance={nounBalanceWithDelegates}
                        disableControls={isAccountOwner}
                      />
                    </div>
                  );
                }

                if (listItem.__typename === 'Comment') {
                  return (
                    <div className="mb-[16px] space-y-4">
                      <ProfileCommentRow key={`comment-${listItem.id}`} comment={listItem} />
                    </div>
                  );
                }

                return null;
              })}
              {!Boolean(data?.propLotProfile?.list?.length) && (
                <Alert variant="secondary">
                  <Alert.Heading>No data found.</Alert.Heading>
                  <p>We couldn't find any data for this user!</p>
                </Alert>
              )}
            </>
          )}
        </div>
      </Col>
    </Section>
  );
};

export default PropLotUserProfile;
