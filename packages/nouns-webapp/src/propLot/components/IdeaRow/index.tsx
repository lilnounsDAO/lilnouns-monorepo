import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../utils/addressAndENSDisplayUtils';
import moment from 'moment';
import { createBreakpoint } from 'react-use';
import IdeaVoteControls from '../IdeaVoteControls';
import { getPropLot_propLot_ideas as Idea } from '../../graphql/__generated__/getPropLot';
import { virtualTagColorMap } from '../../../utils/virtualTagColors';

const useBreakpoint = createBreakpoint({ XL: 1440, L: 940, M: 650, S: 540 });

const IdeaRow = ({ idea, nounBalance }: { idea: Idea; nounBalance: number }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    id,
    tldr,
    title,
    creatorId,
    votecount: voteCount,
    votes,
    createdAt,
    ideaStats,
    tags,
  } = idea;
  const isMobile = breakpoint === 'S';

  const ens = useReverseENSLookUp(creatorId);
  const shortAddress = useShortAddress(creatorId);
  const creatorLilNoun = votes?.find(vote => vote.voterId === creatorId)?.voter?.lilnounCount;

  const mobileHeading = (
    <>
      <div className="flex flex-row flex-1 justify-content-between align-items-center">
        <span className="font-normal lodrina flex text-2xl text-[#8C8D92] overflow-hidden">
          <span className="mr-4">{id}</span>
          <span className="truncate">{ens || shortAddress}</span>
        </span>
        <div className="flex justify-self-end">
          <IdeaVoteControls
            id={id}
            nounBalance={nounBalance}
            voteCount={voteCount}
            votes={votes || []}
            withAvatars={!isMobile}
            refetchPropLotOnVote
          />
        </div>
      </div>
      <div className="flex flex-row flex-1 justify-content-start align-items-center">
        <span className="text-[#212529] font-normal text-2xl flex flex-1 lodrina">{title}</span>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-row space-x-2 mt-4">
          {tags.map(tag => {
            return (
              <span
                className={`${
                  virtualTagColorMap[tag.type] || 'text-blue-500 bg-blue-200'
                } text-xs font-bold rounded-full px-2 py-0.5 inline`}
              >
                {tag.label}
              </span>
            );
          })}
        </div>
      )}
    </>
  );

  const desktopHeading = (
    <div className="flex flex-row flex-1 justify-content-start align-items-center">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <span className="font-normal lodrina flex text-2xl text-[#8C8D92] overflow-hidden">
            <span className="mr-4">{id}</span>
            <span className="truncate">{ens || shortAddress}</span>
          </span>
          <span className="text-[#212529] font-normal text-2xl flex flex-1 lodrina ml-6">
            {title}
          </span>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-row space-x-2 mt-2">
            {tags.map(tag => {
              return (
                <span
                  className={`${
                    virtualTagColorMap[tag.type] || 'text-blue-500 bg-blue-200'
                  } text-xs font-bold rounded-full px-2 py-0.5 inline`}
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-self-end">
        <IdeaVoteControls
          id={id}
          nounBalance={nounBalance}
          voteCount={voteCount}
          votes={votes || []}
          withAvatars={!isMobile}
          refetchPropLotOnVote
        />
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer p-3"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isMobile ? mobileHeading : desktopHeading}
      {isOpen && (
        <>
          <div className="mt-2 flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span
              className="border border-[#e2e3e8] bg-[#f4f4f8] p-4 rounded-lg flex-1"
              dangerouslySetInnerHTML={{ __html: tldr }}
            />
          </div>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-2 pb-2">
            <span className="flex flex-1 font-bold text-sm text-[#8c8d92]">
              {`${ens || shortAddress} | ${
                creatorLilNoun === 1 ? `${creatorLilNoun} lil noun` : `${creatorLilNoun} lil nouns`
              } | ${moment(createdAt, 'x').format('MMM Do YYYY')} | ${
                ideaStats?.comments === 1
                  ? `${ideaStats?.comments} comment`
                  : `${ideaStats?.comments || 0} comments`
              }`}
            </span>
            <span className="justify-self-end text-[#2b83f6] text-sm font-bold flex justify-end">
              <span
                onClick={() => {
                  history.push(`/ideas/${id}`);
                }}
              >
                <span className={`${isMobile ? 'hidden' : ''}`}>See Full Details</span>
                <FontAwesomeIcon
                  className={`${isMobile ? 'text-2xl ml-2' : 'ml-1'}`}
                  icon={faArrowAltCircleRight}
                />
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default IdeaRow;
