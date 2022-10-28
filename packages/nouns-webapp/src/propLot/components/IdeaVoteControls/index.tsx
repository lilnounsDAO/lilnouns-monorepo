import { useEthers } from '@usedapp/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import Davatar from '@davatar/react';
import { useApiError } from '../../../hooks/useApiError';
import { useMutation } from '@apollo/client';

import { useAuth } from '../../../hooks/useAuth';

import propLotClient from '../../graphql/config';
import { SUBMIT_VOTE_MUTATION } from '../../graphql/propLotMutations';

import { submitIdeaVote } from '../../graphql/__generated__/submitIdeaVote';
import { getPropLot_propLot_ideas as Idea } from '../../graphql/__generated__/getPropLot';

import { useEffect, useState } from 'react';

const IdeaVoteControls = ({
  idea,
  nounBalance,
  withAvatars = false,
  refetchPropLotOnVote = false,
}: {
  idea: Idea;
  nounBalance: number;
  withAvatars?: boolean;
  refetchPropLotOnVote?: boolean;
}) => {
  const { id, votecount: voteCount, closed, votes } = idea;
  const { account, library: provider } = useEthers();
  const { getAuthHeader, isLoggedIn, triggerSignIn } = useAuth();
  const { setError, error: errorModalVisible } = useApiError();
  // Store voteCount in state that we can mutate for optimistic updates
  const [calculatedVoteCount, setCalculatedVoteCount] = useState(voteCount);

  const hasVotes = nounBalance > 0;

  const [submitVoteMutation, { error, loading, data }] = useMutation<submitIdeaVote>(
    SUBMIT_VOTE_MUTATION,
    {
      context: {
        clientName: 'PropLot',
      },
      client: propLotClient,
      refetchQueries: refetchPropLotOnVote ? ['getPropLot'] : [],
    },
  );

  const getVoteMutationArgs = (direction: number) => ({
    context: {
      headers: {
        ...getAuthHeader(),
      },
    },
    variables: {
      options: {
        ideaId: id,
        direction: direction,
      },
    },
  });

  const vote = async (direction: number) => {
    if (!isLoggedIn()) {
      try {
        await triggerSignIn();
        submitVoteMutation(getVoteMutationArgs(direction));
      } catch (e) {}
    } else {
      submitVoteMutation(getVoteMutationArgs(direction));
    }
  };

  const usersVote = votes?.find(vote => vote.voterId === account);
  const userHasUpVote = (data?.submitIdeaVote?.direction || usersVote?.direction) === 1;
  const userHasDownVote = (data?.submitIdeaVote?.direction || usersVote?.direction) === -1;

  useEffect(() => {
    if (error && !errorModalVisible) {
      setError({ message: error?.message || 'Failed to vote', status: 500 });
    }
  }, [error]);

  // Optimistic update of the voteCount for quick user feedback.
  useEffect(() => {
    if (data?.submitIdeaVote.ideaId === id) {
      const voteResponse = data?.submitIdeaVote;
      setCalculatedVoteCount(
        calculatedVoteCount + voteResponse?.direction * 2 * (voteResponse?.voter.lilnounCount || 0),
      );
    }
  }, [data]);

  // // If optimistic updates become out of sync with the voteCount prop then reset
  // // to the prop value which comes from the latest API response.
  useEffect(() => {
    if (calculatedVoteCount !== voteCount) {
      setCalculatedVoteCount(voteCount);
    }
  }, [voteCount]);

  const avatarVotes = withAvatars ? votes?.slice(0, 3) || [] : [];

  return (
    <>
      {withAvatars && (
        <span className="flex self-center justify-end pl-2">
          {avatarVotes.map((vote, i) => (
            <span className={i < avatarVotes.length - 1 ? '-mr-2' : ''}>
              <Davatar size={32} address={vote.voterId} provider={provider} />
            </span>
          ))}
        </span>
      )}
      <span className="text-[#212529] font-propLot font-bold text-[18px] sm:text-[26px] self-center justify-end pl-2">
        {loading ? (
          <FontAwesomeIcon
            icon={faCircleNotch}
            className={`fa-spinner fa-spin text-md text-blue-500`}
          />
        ) : (
          calculatedVoteCount
        )}
      </span>
      {!closed && (
        <div className="flex flex-col ml-4">
          <FontAwesomeIcon
            icon={faCaretUp}
            onClick={e => {
              // this prevents the click from bubbling up and opening / closing the hidden section
              e.stopPropagation();
              if (hasVotes && !userHasUpVote && !loading && !closed) {
                vote(1);
              }
            }}
            className={`${loading ? 'fa-beat-fade' : ''} text-3xl cursor-pointer ${
              hasVotes && userHasUpVote ? 'text-blue-500' : 'text-[#8c8d92]'
            }`}
          />

          <FontAwesomeIcon
            icon={faCaretDown}
            onClick={e => {
              e.stopPropagation();
              if (hasVotes && !userHasDownVote && !loading && !closed) {
                vote(-1);
              }
            }}
            className={`${loading ? 'fa-beat-fade' : ''} text-3xl cursor-pointer ${
              hasVotes && userHasDownVote ? 'text-red-500' : 'text-[#8c8d92]'
            }`}
          />
        </div>
      )}
    </>
  );
};

export default IdeaVoteControls;
