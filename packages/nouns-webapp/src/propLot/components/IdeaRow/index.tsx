import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../utils/addressAndENSDisplayUtils';
import moment from 'moment';
import { createBreakpoint } from 'react-use';
import IdeaVoteControls from '../IdeaVoteControls';
import { getPropLot_propLot_ideas as Idea } from '../../graphql/__generated__/getPropLot';
import { virtualTagColorMap } from '../../../utils/virtualTagColors';
import { Button } from 'react-bootstrap';

const useBreakpoint = createBreakpoint({ XL: 1440, L: 940, M: 650, S: 540 });

const IdeaRow = ({
  idea,
  nounBalance,
  disableControls,
}: {
  idea: Idea;
  nounBalance: number;
  disableControls?: boolean;
}) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, tldr, title, creatorId, votes, createdAt, ideaStats, tags } = idea;
  const isMobile = breakpoint === 'S';

  const ens = useReverseENSLookUp(creatorId);
  const shortAddress = useShortAddress(creatorId);
  const creatorLilNoun = votes?.find(vote => vote.voterId === creatorId)?.voter?.lilnounCount;

  const mobileHeading = (
    <>
      <div className="font-propLot font-bold text-[18px] flex flex-row flex-1 justify-content-between align-items-start">
        <span className="flex flex-col sm:flex-row text-[#8C8D92] overflow-hidden">
          <span className="flex flex-row flex-1 justify-content-start align-items-start">
            <span className="mr-4">{id}</span>
            <span className="truncate">{ens || shortAddress}</span>
          </span>
          <div className="flex flex-row flex-1 justify-content-start align-items-start pt-[16px]">
            <span className="font-bold text-[18px] text-[#212529] flex flex-1">{title}</span>
          </div>
        </span>
        <div className="flex justify-self-end">
          <IdeaVoteControls
            idea={idea}
            nounBalance={nounBalance}
            withAvatars={!isMobile}
            refetchPropLotOnVote
            disableControls={disableControls}
          />
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-row flex-wrap gap-[8px] mt-[16px]">
          {tags.map(tag => {
            return (
              <span
                className={`${
                  virtualTagColorMap[tag.type] || 'text-blue-500 bg-blue-200'
                } text-xs font-bold rounded-[8px] px-[8px] py-[4px] flex`}
              >
                {tag.label}
              </span>
            );
          })}
          <span className="flex text-[#8c8d92] font-propLot font-semibold text-[14px]">
            {`${
              ideaStats?.comments === 1
                ? `${ideaStats?.comments} comment`
                : `${ideaStats?.comments || 0} comments`
            }`}
          </span>
        </div>
      )}
    </>
  );

  const desktopHeading = (
    <div className="font-propLot font-bold text-[18px] flex flex-row flex-1 justify-content-start align-items-start">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <span className="flex text-[#8C8D92] overflow-hidden">
            <span className="mr-4">{id}</span>
            <span className="truncate">{ens || shortAddress}</span>
          </span>
          <span className="text-[#212529] flex flex-1 ml-6">{title}</span>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-row flex-wrap gap-[8px] mt-[16px]">
            {tags.map(tag => {
              return (
                <span
                  className={`${
                    virtualTagColorMap[tag.type] || 'text-blue-500 bg-blue-200'
                  } text-xs font-bold rounded-[8px] px-[8px] py-[4px] flex`}
                >
                  {tag.label}
                </span>
              );
            })}
            <span className="flex text-[#8c8d92] font-propLot font-semibold text-[14px]">
              {`${
                ideaStats?.comments === 1
                  ? `${ideaStats?.comments} comment`
                  : `${ideaStats?.comments || 0} comments`
              }`}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-self-end">
        <IdeaVoteControls
          idea={idea}
          nounBalance={nounBalance}
          withAvatars={!isMobile}
          refetchPropLotOnVote
          disableControls={disableControls}
        />
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col border border-[#e2e3e8] rounded-lg cursor-pointer pt-[24px] pb-[24px] px-3"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isMobile ? mobileHeading : desktopHeading}
      {isOpen && (
        <>
          <div className="flex flex-row flex-1 justify-content-start align-items-center pt-[12px] pt-[12px]">
            <span
              className="font-propLot text-[16px] text-[#212529] border border-[#e2e3e8] bg-[#F4F4F8] p-4 rounded-lg flex-1"
              dangerouslySetInnerHTML={{ __html: tldr }}
            />
          </div>
          <div className="font-propLot font-semibold text-[14px] flex-col sm:flex-row flex flex-1 justify-content-start align-items-start pt-[12px] pt-[12px]">
            <span className="flex flex-1 text-[#8c8d92] whitespace-pre">
              <span
                className="text-[#2B83F6] underline cursor-pointer"
                onClick={() => {
                  history.push(`/proplot/profile/${idea.creatorId}`);
                }}
              >
                {ens || shortAddress}
              </span>{' '}
              {` | ${
                creatorLilNoun === 1 ? `${creatorLilNoun} lil noun` : `${creatorLilNoun} lil nouns`
              } | ${moment(createdAt).format('MMM Do YYYY')}`}
            </span>
            <span className="flex mt-[16px] sm:mt-[0px] w-full sm:w-auto justify-self-end text-[#2b83f6] flex justify-end">
              <Button
                className="font-propLot font-semibold text-[16px] flex flex-1 btn !rounded-[10px] bg-white border border-[#E2E3E8] p-0 hover:!bg-[#F4F4F8] focus:!bg-[#E2E3E8] !text-[#2B83F6]"
                onClick={() => {
                  history.push(`/ideas/${id}`);
                }}
              >
                <span className="flex items-center justify-center font-semibold text-[16px] normal-case pt-[8px] pb-[8px] pl-[16px] pr-[16px]">
                  Details
                </span>
              </Button>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default IdeaRow;
