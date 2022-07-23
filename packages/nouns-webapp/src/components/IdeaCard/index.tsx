import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Idea, VoteFormData } from '../../hooks/useIdeas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../ShortAddress';

import IdeaVoteControls from '../IdeaVoteControls';

const IdeaCard = ({
  idea,
  voteOnIdea,
  nounBalance,
}: {
  idea: Idea;
  voteOnIdea: (formData: VoteFormData) => void;
  nounBalance: number;
}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, tldr, title, creatorId, votecount: voteCount, votes } = idea;

  const ens = useReverseENSLookUp(creatorId);
  const shortAddress = useShortAddress(creatorId);
  const creatorLilNoun = votes?.find(vote => vote.voterId === creatorId)?.voter?.lilnounCount;

  return (
    <div
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-2 px-3 pb-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-row flex-1 justify-content-start align-items-center">
        <span className="font-normal lodrina flex text-2xl text-[#8C8D92] overflow-hidden">
          <span className="mr-4">{id}</span>
          <span className="truncate">{ens || shortAddress}</span>
        </span>
        <span className="text-[#212529] font-normal text-2xl flex flex-1 lodrina ml-6">
          {title}
        </span>
        <div className="flex justify-self-end">
          <IdeaVoteControls
            id={id}
            voteOnIdea={voteOnIdea}
            nounBalance={nounBalance}
            voteCount={voteCount}
            votes={votes}
            withAvatars
          />
        </div>
      </div>
      {isOpen && (
        <>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span
              className="border border-[#e2e3e8] bg-[#f4f4f8] p-4 rounded-lg flex-1"
              dangerouslySetInnerHTML={{ __html: tldr }}
            />
          </div>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span className="flex flex-1 font-bold text-sm text-[#8c8d92]">
              {ens || shortAddress} | {creatorLilNoun} lil nouns
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
