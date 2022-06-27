import { Alert, Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { useAuth } from '../../hooks/useAuth';
import classes from './Ideas.module.css';
import { isMobileScreen } from '../../utils/isMobile';
import IdeaCard from '../IdeaCard';
import { useIdeaAPI } from '../../api/Idea';

const Ideas = () => {
  const IdeaAPI = useIdeaAPI();
  const history = useHistory();
  const { account } = useEthers();
  const { isLoggedIn, triggerSignIn } = useAuth();
  const ideas = IdeaAPI.getIdeas();

  const handleLogin = async () => {
    await triggerSignIn(() => alert('Logged in, move to submit page'));
  };

  // doesn't seem to be working, but makes sense, since I don't have any ln on rinkeby
  const connectedAccountNounVotes = useUserVotes() || 0;
  console.log(connectedAccountNounVotes);

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no Votes.';
    }
    return 'Connect wallet to submit an idea.';
  };

  // set to true for testing
  const hasNouns = connectedAccountNounVotes > 0;

  return (
    <div>
      <div>
        <h3 className={classes.heading}>Ideas</h3>
        {account !== undefined && hasNouns ? (
          <div className={classes.submitIdeaButtonWrapper}>
            <Button
              className={classes.generateBtn}
              onClick={() => (!isLoggedIn ? handleLogin() : history.push('/ideas/create'))}
            >
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
          {ideas.map((idea: any, i) => {
            return <IdeaCard idea={idea} key={`idea-${i}`} />;
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
