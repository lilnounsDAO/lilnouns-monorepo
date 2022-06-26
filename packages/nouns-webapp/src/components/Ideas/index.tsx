import { Alert, Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../hooks/useAuth';
import { useIdeas } from '../../hooks/useIdeas';
import { faArrowAltCircleRight, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import classes from './Ideas.module.css';
import { isMobileScreen } from '../../utils/isMobile';

const HOST = 'http://localhost:5001';

const IdeaContainer = ({ idea }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, description, tldr, title, creatorId } = idea;

  return (
    <div
      className="grid grid-cols-6 gap-y-4 border border-[#e2e3e8] rounded-lg cursor-pointer pt-2 px-3 pb-3"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="lodrina self-center justify-self-center text-2xl text-[#8C8D92]">
        <span className="mr-4">{id}</span>
        <span>Creator.eth </span>
      </span>
      <span className="text-[#212529] col-span-4 font-bold text-2xl place-self-center lodrina">
        {title}
      </span>
      <div className="flex flex-row justify-end">
        <span className="text-2xl font-bold lodrina self-center justify-end">{0}</span>
        <div className="flex flex-col ml-4">
          <FontAwesomeIcon
            icon={faCaretUp}
            onClick={e => {
              // this prevents the click from bubbling up and opening / closing the hidden section
              e.stopPropagation();
              alert('upvoting');
            }}
            className="text-[#8c8d92] text-2xl"
          />

          <FontAwesomeIcon
            icon={faCaretDown}
            onClick={e => {
              e.stopPropagation();
              alert('downvoting');
            }}
            className="text-[#8c8d92] text-2xl"
          />
        </div>
      </div>
      {isOpen && (
        <>
          <span
            className="border border-[#e2e3e8] bg-[#f4f4f8] p-4 rounded-lg col-span-6"
            dangerouslySetInnerHTML={{ __html: tldr }}
          />
          <span className="col-span-3 font-bold text-sm text-[#8c8d92]">
            creator.eth | 12 lil nouns | 134 votes
          </span>
          <span className="col-span-3 text-[#2b83f6] text-sm font-bold flex justify-end">
            <span>
              See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </span>
          </span>
        </>
      )}
    </div>
  );
};

// Lots going on in here for now
const Ideas = () => {
  const history = useHistory();
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
            return <IdeaContainer idea={idea} key={`idea-${i}`} />;
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
