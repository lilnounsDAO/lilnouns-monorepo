import { Alert, Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './Ideas.module.css';
import { isMobileScreen } from '../../utils/isMobile';
import IdeaCard from '../IdeaCard';
import { useIdeas } from '../../hooks/useIdeas';

const Ideas = () => {
  const { account } = useEthers();
  const history = useHistory();
  const { getIdeas, voteOnIdeaList } = useIdeas();

  const ideas = getIdeas();

  const connectedAccountNounVotes = useUserVotes() || 0;

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no Votes.';
    }
    return 'Connect wallet to submit an idea.';
  };

  const hasNouns = connectedAccountNounVotes > 0;

  return (
    <div>
      <div>
        <h3 className={classes.heading}>Ideas</h3>
        {account !== undefined && hasNouns ? (
          <div className={classes.submitIdeaButtonWrapper}>
            <Button className={classes.generateBtn} onClick={() => history.push('/ideas/create')}>
              Submit Idea
            </Button>
          </div>
        ) : (
          <div className={clsx('d-flex', classes.submitIdeaButtonWrapper)}>
            {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
            <div className={classes.nullBtnWrapper}>
              <Button className={classes.generateBtnDisabled}>Submit Idea</Button>
            </div>
          </div>
        )}
      </div>
      {isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
      {ideas?.length ? (
        <span className="space-y-4">
          {ideas.map((idea, i) => {
            return (
              <IdeaCard
                idea={idea}
                key={`idea-${idea.id}`}
                voteOnIdea={voteOnIdeaList}
                connectedAccountNounVotes={connectedAccountNounVotes}
              />
            );
          })}
        </span>
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>No ideas found.</Alert.Heading>
          <p>Ideas submitted by community members will appear here.</p>
        </Alert>
      )}
    </div>
  );
};

export default Ideas;
