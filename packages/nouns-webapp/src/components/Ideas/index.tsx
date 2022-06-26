import { Alert, Button } from 'react-bootstrap';
import classes from './Ideas.module.css';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../hooks/useAuth';
import { useIdeas } from '../../hooks/useIdeas';
import { faArrowAltCircleRight, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const HOST = 'http://localhost:5001';

const getIdeaId = (idea: any) => {
  if (!idea.ref) {
    return null;
  }
  return idea.ref['@ref'].id;
};

const IdeaContainer = ({ idea }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { created_by: createdBy, title, tldr, upvotes, downvotes } = idea.data;
  const id = getIdeaId(idea);

  return (
    <>
      <div className={classes.ideaContainer} onClick={() => setIsOpen(!isOpen)}>
        <span className={classes.ideaContainerCreatedBy}>{createdBy}</span>
        <span className={classes.ideaContainerTitle}>{title}</span>
        <div className={classes.ideaContainerVotingContainer}>
          <span className={classes.ideaContainerUpvotes}>{upvotes.length - downvotes.length}</span>
          <div className={classes.votingContainer}>
            <span onClick={() => alert('upvoting')} className={classes.voteIcon}>
              <FontAwesomeIcon icon={faCaretUp} size="2x" />
            </span>
            <span onClick={() => alert('downvoting')} className={classes.voteIcon}>
              <FontAwesomeIcon icon={faCaretDown} size="2x" />
            </span>
          </div>
        </div>
        {isOpen && (
          <>
            <span
              className={classes.ideaContainerTldr}
              dangerouslySetInnerHTML={{ __html: tldr }}
            />
            <span className={classes.ideaContainerDetails}>{createdBy}</span>
            <span className={classes.ideaContainerLearnMore}>
              See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </span>
          </>
        )}
      </div>
    </>
  );
};

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
          return <IdeaContainer idea={idea} key={`idea-${i}`} />;
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
