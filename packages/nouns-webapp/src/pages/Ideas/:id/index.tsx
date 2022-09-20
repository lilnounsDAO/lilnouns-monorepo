import { useState } from 'react';
import { Button, Col, FormControl, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Section from '../../../layout/Section';
import classes from '../Ideas.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../utils/addressAndENSDisplayUtils';
import {
  useIdeas,
  CommentFormData,
  Comment as CommentType,
  VoteFormData,
} from '../../../hooks/useIdeas';
import { useAccountVotes } from '../../../wrappers/nounToken';
import IdeaVoteControls from '../../../components/IdeaVoteControls';
import moment from 'moment';
import Davatar from '@davatar/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { createBreakpoint } from 'react-use';

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
  const html = linkRenderer.call(renderer, href, title, text);
  return localLink
    ? html
    : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
};

marked.setOptions({
  renderer: renderer,
});

const useBreakpoint = createBreakpoint({ XL: 1440, L: 940, M: 650, S: 540 });

const CommentInput = ({
  value,
  setValue,
  hasNouns,
  hideInput = undefined,
  onSubmit,
}: {
  value: string;
  setValue: (val: string) => void;
  hasNouns: boolean;
  hideInput?: (val: boolean) => void;
  onSubmit: () => void;
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'S';
  const canHideInput = typeof hideInput === 'function';

  return (
    <div className="relative mt-4">
      <FormControl
        as="textarea"
        placeholder="Type your commment..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`border rounded-lg w-full pt-3 pb-3 pl-3 ${
          canHideInput && !isMobile ? '!pr-[162px]' : '!pr-[90px]'
        } relative`}
      />
      <div
        className={`absolute right-2 bottom-[10px] ${
          isMobile ? 'flex align-items-center flex-column-reverse' : ''
        }`}
      >
        {canHideInput && (
          <span
            className={`font-bold text-[#8C8D92] cursor-pointer ${isMobile ? '!pt-[8px]' : 'mr-4'}`}
            onClick={() => hideInput(true)}
          >
            Cancel
          </span>
        )}

        <Button
          className={`${
            hasNouns
              ? 'rounded-lg !bg-[#2B83F6] !text-white !font-bold'
              : '!text-[#8C8D92] !bg-[#F4F4F8] !border-[#E2E3E8] !font-bold'
          } p-1 rounded`}
          onClick={() => {
            if (hasNouns && value.length > 0) {
              onSubmit();
            }
          }}
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  hasNouns,
  level,
}: {
  comment: CommentType;
  hasNouns: boolean;
  level: number;
}) => {
  const { id } = useParams() as { id: string };
  const [isReply, setIsReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const [showReplies, setShowReplies] = useState<boolean>(level > 1);
  const { account, library: provider } = useEthers();
  const ens = useReverseENSLookUp(comment.authorId);
  const shortAddress = useShortAddress(comment.authorId);
  const { commentOnIdea } = useIdeas();

  const submitReply = async () => {
    await commentOnIdea({
      body: reply,
      ideaId: parseInt(id),
      parentId: comment.id,
      authorId: account,
    } as CommentFormData);
    setReply('');
    setIsReply(false);
  };

  return (
    <div key={comment.id}>
      <div className="flex flex-row items-center space-x-4">
        <span className="text-2xl text-[#8C8D92] flex align-items-center">
          <Davatar size={28} address={comment.authorId} provider={provider} />
          <span className="lodrina pl-2">{ens || shortAddress}</span>
          <span className="text-[#8C8D92] text-base pl-2">
            {moment(comment.createdAt).fromNow()}
          </span>
        </span>
        {level < 4 && (
          <span
            className="text-[#2B83F6] text-base cursor-pointer"
            onClick={() => setIsReply(true)}
          >
            Reply
          </span>
        )}
        {/* Future addition: Add view more button to move deeper into the thread? */}
      </div>

      <p className="text-[#212529] text-lg whitespace-pre-wrap">{comment.body}</p>

      {!!comment.replies?.length && level === 1 && (
        <span
          className="text-[#212529] text-base cursor-pointer font-bold"
          onClick={() => setShowReplies(!showReplies)}
        >
          {`${showReplies ? 'Hide' : 'Show'} replies`}
        </span>
      )}

      {showReplies && (
        <div className={`border-l border-gray-200 ${level === 1 ? 'pt-8' : ''}`}>
          {comment.replies?.map(reply => {
            return (
              <div className="ml-8" key={`replies-${reply.id}`}>
                <Comment comment={reply} hasNouns={hasNouns} level={level + 1} />
              </div>
            );
          })}
        </div>
      )}

      {isReply && (
        <CommentInput
          value={reply}
          setValue={setReply}
          hideInput={(isHidden: boolean) => setIsReply(!isHidden)}
          hasNouns={hasNouns}
          onSubmit={submitReply}
        />
      )}
    </div>
  );
};

const IdeaPage = () => {
  const { id } = useParams() as { id: string };
  const history = useHistory();
  const { account } = useEthers();
  const { getIdea, getComments, commentOnIdea, voteOnIdea } = useIdeas();
  const { comments, error } = getComments(id);
  const idea = getIdea(id);

  const [comment, setComment] = useState<string>('');
  const nounBalance = useAccountVotes(account || undefined) ?? 0;
  const ens = useReverseENSLookUp(idea?.creatorId);
  const shortAddress = useShortAddress(idea?.creatorId);

  const castVote = async (formData: VoteFormData) => {
    await voteOnIdea(formData);
  };

  const submitComment = async () => {
    await commentOnIdea({
      body: comment,
      ideaId: parseInt(id),
      authorId: account,
    } as CommentFormData);
    setComment('');
  };

  if (!idea) {
    return <div>loading</div>;
  }

  const hasNouns = nounBalance > 0;
  const creatorLilNoun = idea.votes?.find(vote => vote.voterId === idea.creatorId)?.voter
    ?.lilnounCount;

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <div>
            <span className="cursor-pointer inline-block" onClick={() => history.push('/ideas')}>
              <FontAwesomeIcon
                icon={faArrowAltCircleLeft}
                className={`mr-2 text-2xl cursor-pointer`}
              />
              Back
            </span>
          </div>
          <div className="flex flex-row justify-between items-center mb-12">
            <h1 className="mb-0">{idea.title}</h1>
            <div className="flex flex-row justify-end">
              <IdeaVoteControls
                id={idea.id}
                voteOnIdea={castVote}
                nounBalance={nounBalance}
                voteCount={idea.votecount}
                votes={idea.votes}
                withAvatars
              />
            </div>
          </div>
        </Row>
        <div className="space-y-8">
          <div className="flex flex-col">
            <h3 className="lodrina font-bold text-2xl mb-2">tl:dr</h3>
            <p>{idea.tldr}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="lodrina font-bold text-2xl mb-2">Description</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(idea.description), {
                  ADD_ATTR: ['target'],
                }),
              }}
            />
          </div>
        </div>

        <div className="flex flex-1 font-bold text-sm text-[#8c8d92] mt-12">
          {`${ens || shortAddress} | ${
            creatorLilNoun === 1 ? `${creatorLilNoun} lil noun` : `${creatorLilNoun} lil nouns`
          } | ${moment(idea.createdAt).format('MMM Do YYYY')}`}
        </div>

        <div className="mt-2 mb-2">
          <h3 className="text-2xl lodrina font-bold">
            {comments?.length} {comments?.length === 1 ? 'comment' : 'comments'}
          </h3>
        </div>

        {error ? (
          <div className="mt-12 mb-2">
            <h3 className="text-2xl lodrina font-bold">Failed to load commments</h3>
          </div>
        ) : (
          <>
            <CommentInput
              value={comment}
              setValue={setComment}
              hasNouns={hasNouns}
              onSubmit={submitComment}
            />
            <div className="mt-12 space-y-8">
              {comments?.map(comment => {
                return (
                  <Comment
                    comment={comment}
                    key={`comment-${comment.id}`}
                    hasNouns={hasNouns}
                    level={1}
                  />
                );
              })}
            </div>
          </>
        )}
      </Col>
    </Section>
  );
};

export default IdeaPage;
