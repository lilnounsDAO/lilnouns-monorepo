import { useState, useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Section from '../../../layout/Section';
import classes from '../Ideas.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useIdeaAPI, Vote } from '../../../api/Idea';
import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../components/ShortAddress';

const Comment = ({ comment }) => {
  const IdeaAPI = useIdeaAPI();
  const { id } = useParams() as { id: string };
  const [isReply, setIsReply] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const ens = useReverseENSLookUp(comment.authorId);
  const shortAddress = useShortAddress(comment.authorId);

  const submitReply = async () => {
    const response = await IdeaAPI.commentOnIdea({
      body: reply,
      ideaId: parseInt(id),
      parentId: comment.id,
    });
    setReply('');
    IdeaAPI.revalidateIdea(id);
  };

  return (
    <div>
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
              <div className="ml-8">
                <Comment comment={reply} />
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
              className="p-2 border-blue-500 bg-blue-500 text-white rounded"
              onClick={() => {
                submitReply();
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
  const IdeaAPI = useIdeaAPI();
  const { id } = useParams() as { id: string };
  const history = useHistory();
  const { account } = useEthers();
  const [userVote, setUserVote] = useState<Vote>();
  const [ideaScore, setIdeaScore] = useState<number>(0);
  const [comment, setComment] = useState<string>();

  const idea = IdeaAPI.getIdea(id);
  const votes = IdeaAPI.getVotes(id);

  useEffect(() => {
    if (votes) {
      setUserVote(votes.find(vote => vote.voterId === account));
      setIdeaScore(
        votes.reduce((sum, vote) => {
          return sum + vote.direction;
        }, 0),
      );
    }
  }, [votes, account]);

  const castVote = async (dir: number) => {
    const v = await IdeaAPI.voteOnIdea({
      direction: dir,
      ideaId: parseInt(id),
    });
    IdeaAPI.revalidateVotes(id);
  };

  if (!idea) {
    return <div>loading</div>;
  }

  const submitComment = async () => {
    const response = await IdeaAPI.commentOnIdea({
      body: comment,
      ideaId: parseInt(id),
    });
    setComment('');
    IdeaAPI.revalidateIdea(id);
  };

  console.log(idea.comments);

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
              <h5 className="text-4xl font-bold lodrina self-center justify-end mb-0">
                {ideaScore}
              </h5>
              <div className="flex flex-col ml-4">
                <FontAwesomeIcon
                  icon={faCaretUp}
                  onClick={() => {
                    castVote(1);
                  }}
                  className={` text-4xl cursor-pointer ${
                    userVote && userVote.direction === 1 ? 'text-blue-500' : 'text-[#8c8d92]'
                  }`}
                />

                <FontAwesomeIcon
                  icon={faCaretDown}
                  onClick={() => {
                    castVote(-1);
                  }}
                  className={` text-4xl cursor-pointer ${
                    userVote && userVote.direction === -1 ? 'text-red-500' : 'text-[#8c8d92]'
                  }`}
                />
              </div>
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
              className="p-2 border-blue-500 bg-blue-500 text-white rounded"
              onClick={() => {
                submitComment();
              }}
            >
              Comment
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-8">
          {idea.comments.map((comment, idx) => {
            return <Comment comment={comment} key={`comment-${idx}`} />;
          })}
        </div>
      </Col>
    </Section>
  );
};

export default IdeaPage;
