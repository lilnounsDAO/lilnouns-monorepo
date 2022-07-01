import { useEthers } from '@usedapp/core';
import { Vote } from '../../hooks/useIdeas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const IdeaVoteControls = ({
  id,
  votes,
  voteOnIdea,
  hasVotes,
}: {
  id: number;
  votes: Vote[];
  voteOnIdea: (args: any) => void;
  hasVotes: boolean;
}) => {
  const { account } = useEthers();
  const vote = (dir: number) =>
    voteOnIdea({
      direction: dir,
      ideaId: id,
      voterId: account,
    });

  const usersVote = votes.find(vote => vote.voterId === account);
  const userHasUpVote = usersVote && usersVote.direction === 1;
  const userHasDownVote = usersVote && usersVote.direction === -1;
  const ideaScore = votes.reduce((sum, vote) => {
    return sum + vote.direction;
  }, 0);

  return (
    <>
      <span className="text-2xl font-bold lodrina self-center justify-end">{ideaScore}</span>
      <div className="flex flex-col ml-4">
        <FontAwesomeIcon
          icon={faCaretUp}
          onClick={e => {
            // this prevents the click from bubbling up and opening / closing the hidden section
            e.stopPropagation();
            if (hasVotes && !userHasUpVote) {
              vote(1);
            }
          }}
          className={` text-2xl ${hasVotes && userHasUpVote ? 'text-blue-500' : 'text-[#8c8d92]'}`}
        />

        <FontAwesomeIcon
          icon={faCaretDown}
          onClick={e => {
            e.stopPropagation();
            if (hasVotes && !userHasDownVote) {
              vote(-1);
            }
          }}
          className={` text-2xl ${hasVotes && userHasDownVote ? 'text-red-500' : 'text-[#8c8d92]'}`}
        />
      </div>
    </>
  );
};

export default IdeaVoteControls;
