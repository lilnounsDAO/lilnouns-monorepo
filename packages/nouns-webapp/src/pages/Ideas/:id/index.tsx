import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Section from '../../../layout/Section';
import classes from '../Ideas.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../components/ShortAddress';
import {
  useIdeas,
  CommentFormData,
  Comment as CommentType,
  VoteFormData,
} from '../../../hooks/useIdeas';
import { useUserVotes } from '../../../wrappers/nounToken';
import IdeaVoteControls from '../../../components/IdeaVoteControls';

const Comment = ({ comment, hasNouns }: { comment: CommentType; hasNouns: boolean }) => {
  const { id } = useParams() as { id: string };
  const [isReply, setIsReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const { account } = useEthers();
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
        <span className="text-xl lodrina text-gray-400">{ens || shortAddress}</span>
        <span className="text-blue-500 cursor-pointer" onClick={() => setIsReply(true)}>
          Reply
        </span>
      </div>

      <p>{comment.body}</p>
      <div className="border-l border-gray-200">
        {comment.replies &&
          comment.replies.map(reply => {
            return (
              <div className="ml-8" key={`replies-${reply.id}`}>
                <Comment comment={reply} hasNouns={hasNouns} />
              </div>
            );
          })}
      </div>
      {isReply && (
        <div className="relative my-4">
          <input
            value={reply}
            onChange={e => setReply(e.target.value)}
            type="text"
            className="border rounded-lg w-full p-3 relative"
            placeholder="Type your commment..."
          />
          <div className="absolute right-2 top-2">
            <span className="mr-4 font-bold text-gray-400" onClick={() => setIsReply(false)}>
              Cancel
            </span>
            <button
              className={`${
                hasNouns
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'text-[#8C8D92] bg-[#F4F4F8] border-[#E2E3E8]-1'
              } p-2 rounded`}
              onClick={() => {
                if (hasNouns) {
                  submitReply();
                }
              }}
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const IdeaPage = () => {
  const { id } = useParams() as { id: string };
  const history = useHistory();
  const { account } = useEthers();
  const [comment, setComment] = useState<string>();
  const connectedAccountNounVotes = useUserVotes() || 0;

  const { getIdea, commentOnIdea, voteOnIdea } = useIdeas();

  const idea = getIdea(id);

  const castVote = async (formData: VoteFormData) => {
    await voteOnIdea(formData);
  };

  if (!idea) {
    return <div>loading</div>;
  }

  const submitComment = async () => {
    await commentOnIdea({
      body: comment,
      ideaId: parseInt(id),
      authorId: account,
    } as CommentFormData);
    setComment('');
  };

  const hasNouns = connectedAccountNounVotes > 0;

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
                votes={idea.votes}
                voteOnIdea={castVote}
                hasVotes={connectedAccountNounVotes > 0}
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
            <p>{idea.description}</p>
          </div>
        </div>

        <div className="mt-12 mb-2">
          <h3 className="text-2xl lodrina font-bold">
            {idea.comments.length} {idea.comments.length === 1 ? 'comment' : 'comments'}
          </h3>
        </div>

        <div className="relative mt-4">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            type="text"
            className="border rounded-lg w-full p-3 relative"
            placeholder="Type your commment..."
          />
          <div className="absolute right-2 top-2">
            <button
              className={`${
                hasNouns
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'text-[#8C8D92] bg-[#F4F4F8] border-[#E2E3E8]-1'
              } p-2 rounded`}
              onClick={() => {
                if (hasNouns) {
                  submitComment();
                }
              }}
            >
              Comment
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-8">
          {idea.comments.map(comment => {
            return <Comment comment={comment} key={`comment-${comment.id}`} hasNouns={hasNouns} />;
          })}
        </div>
      </Col>
    </Section>
  );
};

export default IdeaPage;
