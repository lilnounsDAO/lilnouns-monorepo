import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Section from '../../../layout/Section';
import { useIdeas } from '../../../hooks/useIdeas';
import classes from '../Ideas.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useIdeaAPI } from '../../../api/Idea';

interface Vote {
  direction: number;
  voterId: string;
}

interface Idea {
  title: string;
  tldr: string;
  description: string;
  votes: Vote[];
}

const IdeaPage = () => {
  const IdeaAPI = useIdeaAPI();
  const { voteOnIdea } = useIdeas();
  const { id } = useParams() as { id: string };
  const history = useHistory();
  const { account } = useEthers();
  const [userVote, setUserVote] = useState<Vote>();
  const [ideaScore, setIdeaScore] = useState<number>(0);

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

  const vote = async dir => {
    const v = await voteOnIdea({
      direction: dir,
      ideaId: parseInt(id),
      voterAddress: account,
    });
    IdeaAPI.revalidateVotes(id);
  };

  if (!idea) {
    return <div>loading</div>;
  }

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
                  onClick={e => {
                    // this prevents the click from bubbling up and opening / closing the hidden section
                    e.stopPropagation();
                    vote(1);
                  }}
                  className={` text-4xl cursor-pointer ${
                    userVote && userVote.direction === 1 ? 'text-blue-500' : 'text-[#8c8d92]'
                  }`}
                />

                <FontAwesomeIcon
                  icon={faCaretDown}
                  onClick={e => {
                    e.stopPropagation();
                    vote(-1);
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
      </Col>
    </Section>
  );
};

export default IdeaPage;
