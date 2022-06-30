import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { Vote, Idea, VoteFormData } from '../../hooks/useIdeas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../ShortAddress';

const VoteControls = ({
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

const IdeaCard = ({
  idea,
  voteOnIdea,
  connectedAccountNounVotes,
}: {
  idea: Idea;
  voteOnIdea: (formData: VoteFormData) => void;
  connectedAccountNounVotes: number;
}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, description, title, votes, creatorId } = idea;

  const ens = useReverseENSLookUp(creatorId);
  const shortAddress = useShortAddress(creatorId);

  return (
    <div
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-2 px-3 pb-3"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-row flex-1 justify-content-start align-items-center">
        <span className="lodrina flex text-2xl text-[#8C8D92]">
          <span className="mr-4">{id}</span>
          <span>{ens || shortAddress}</span>
        </span>
        <span className="text-[#212529] font-bold text-2xl flex flex-1 lodrina ml-6">{title}</span>
        <div className="flex justify-self-end">
          <VoteControls
            id={id}
            votes={votes}
            voteOnIdea={voteOnIdea}
            hasVotes={connectedAccountNounVotes > 0}
          />
        </div>
      </div>
      {isOpen && (
        <>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span
              className="border border-[#e2e3e8] bg-[#f4f4f8] p-4 rounded-lg flex-1"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span className="flex flex-1 font-bold text-sm text-[#8c8d92]">
              {ens || shortAddress} | {connectedAccountNounVotes} lil nouns
            </span>
            <span className="flex justify-self-end text-[#2b83f6] text-sm font-bold flex justify-end">
              <span
                onClick={() => {
                  history.push(`/ideas/${id}`);
                }}
              >
                See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default IdeaCard;