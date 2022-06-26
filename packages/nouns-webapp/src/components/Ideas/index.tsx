import { Alert, Button } from 'react-bootstrap';
import classes from './Ideas.module.css';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIdeas } from '../../hooks/useIdeas';

// Lots going on in here for now
const Ideas = () => {
  const { account } = useEthers();
  const { isLoggedIn, triggerSignIn } = useAuth();
  const { ideas, getIdeas } = useIdeas();

  const handleLogin = async () => {
    await triggerSignIn(() => alert('Logged in, move to submit page'));
  };

  const connectedAccountNounVotes = useUserVotes() || 0;

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no Votes.';
    }
    return 'Connect wallet to submit an idea.';
  };

  useEffect(() => {
    getIdeas();
  }, []);

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
              onClick={() => (!isLoggedIn ? handleLogin() : alert('Create Idea Form'))}
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
        ideas.map((idea: any, i) => {
          const { id, creatorId, title, tldr, upvotes = [] } = idea;
          return (
            <div
              className={classes.ideaLink}
              onClick={() => console.log(`Open new page for ${id}`)}
              key={id}
            >
              <span className={classes.ideaTitle}>
                <span className={classes.titleSpan}>{title}</span>{' '}
                <span className={classes.likeSpan}>Upvotes: {upvotes.length}</span>
              </span>
              {Boolean(tldr) && (
                <span className={classes.tldr}>
                  <span dangerouslySetInnerHTML={{ __html: tldr }} />
                </span>
              )}
              <span className={classes.metaData}>
                <span className={classes.userDetails}>{creatorId}</span>
                <span className={classes.linkDiscourse}>
                  See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} />
                </span>
              </span>
            </div>
          );
        })
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
