import { useEthers } from '@usedapp/core';
import { Vote } from '../../hooks/useIdeas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const IdeaVoteControls = ({
  id,
  voteOnIdea,
  connectedAccountNounVotes,
  voteCount,
  voters,
}: {
  id: number;
  voteOnIdea: (args: any) => void;
  connectedAccountNounVotes: number;
  voteCount: number;
  voters: any;
}) => {
  const { account } = useEthers();
  const hasVotes = connectedAccountNounVotes > 0;

  const usersVote = voters?.find((voter: any) => voter.wallet === account);
  const userHasUpVote = usersVote?.direction === 1;
  const userHasDownVote = usersVote?.direction === -1;

  const vote = (dir: number) =>
    voteOnIdea({
      direction: dir,
      ideaId: id,
      voterId: account,
      voter: {
        lilnounCount: connectedAccountNounVotes,
      },
    });

  return (
    <>
      <span className="text-3xl text-black font-bold lodrina self-center justify-end">
        {voteCount}
      </span>
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
          className={`text-3xl ${hasVotes && userHasUpVote ? 'text-blue-500' : 'text-[#8c8d92]'}`}
        />

        <FontAwesomeIcon
          icon={faCaretDown}
          onClick={e => {
            e.stopPropagation();
            if (hasVotes && !userHasDownVote) {
              vote(-1);
            }
          }}
          className={`text-3xl ${hasVotes && userHasDownVote ? 'text-red-500' : 'text-[#8c8d92]'}`}
        />
      </div>
    </>
  );
};

export default IdeaVoteControls;
