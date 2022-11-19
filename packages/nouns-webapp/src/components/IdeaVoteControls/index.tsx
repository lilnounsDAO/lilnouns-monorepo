import { useEthers } from '@usedapp/core';
import { Idea, Vote } from '../../hooks/useIdeas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Davatar from '@davatar/react';
import { getIdea_getIdea } from '../../propLot/graphql/__generated__/getIdea';

const IdeaVoteControls = ({
  idea,
  voteOnIdea,
  nounBalance,
  withAvatars = false,
}: {
  idea: Idea | getIdea_getIdea;
  voteOnIdea: (args: any) => void;
  nounBalance: number;
  withAvatars?: boolean;
}) => {
  const { id, votes, votecount: voteCount, closed } = idea;
  const { account, library: provider } = useEthers();
  const hasVotes = nounBalance > 0;

  const usersVote = votes?.find(vote => vote.voterId === account);
  const userHasUpVote = usersVote?.direction === 1;
  const userHasDownVote = usersVote?.direction === -1;

  const vote = (dir: number) =>
    voteOnIdea({
      direction: dir,
      ideaId: id,
      voterId: account,
      voter: {
        lilnounCount: nounBalance,
      },
    });

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
      <span className="text-3xl text-black font-bold lodrina self-center justify-end pl-2">
        {voteCount}
      </span>
      {!closed && (
        <div className="flex flex-col ml-4">
          <FontAwesomeIcon
            icon={faCaretUp}
            onClick={e => {
              // this prevents the click from bubbling up and opening / closing the hidden section
              e.stopPropagation();
              if (hasVotes && !userHasUpVote && !closed) {
                vote(1);
              }
            }}
            className={`text-3xl cursor-pointer ${
              hasVotes && userHasUpVote ? 'text-blue-500' : 'text-[#8c8d92]'
            }`}
          />

          <FontAwesomeIcon
            icon={faCaretDown}
            onClick={e => {
              e.stopPropagation();
              if (hasVotes && !userHasDownVote && !closed) {
                vote(-1);
              }
            }}
            className={`text-3xl cursor-pointer ${
              hasVotes && userHasDownVote ? 'text-red-500' : 'text-[#8c8d92]'
            }`}
          />
        </div>
      )}
    </>
  );
};

export default IdeaVoteControls;
