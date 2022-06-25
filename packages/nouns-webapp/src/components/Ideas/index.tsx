import { Alert, Button } from 'react-bootstrap';
import classes from './Ideas.module.css';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';

const HOST = "http://localhost:5001";

const getIdeaId = (idea: any) => {
  if (!idea.ref) {
    return null
  }
  return idea.ref['@ref'].id
}

// Lots going on in here for now
const Ideas = () => {
  const { library, account, chainId} = useEthers();
  const [loggedIn, setLoggedIn] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const connectedAccountNounVotes = useUserVotes() || 0;

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no Votes.';
    }
    return 'Connect wallet to submit an idea.';
  };

  useEffect(() => {
    const getSession = async () => {
      const res = await fetch(`${HOST}/session`, {
          credentials: 'include',
      });
      const data = await res.json();
  
      if (data?.type === 'AUTHENTICATED') {
        setLoggedIn(true);
      }
    }

    const getIdeas = async () => {
      const res = await fetch(`${HOST}/ideas`, {
          credentials: 'include',
      });
      const { data } = await res.json();
  
      if (res.status === 200) {
        setIdeas(data);
      }
    }

    getSession();
    getIdeas();
  }, []);


  // Use to submit an idea
  const submitIdea = async () => {
    const res = await fetch(`${HOST}/ideas`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: {
          title: 'Testing',
          tldr: 'testing',
          description: 'test',
        }}),
    });
    const { data } = await res.json();
    if (res.status === 200) {
      setIdeas(data);
    }
  }

  // Create message for user to sign to authenticate.
  const createSiweMessage = async (address: string | undefined, statement: string) => {
    const res = await fetch(`${HOST}/nonce`, {
        credentials: 'include',
    });
    const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await res.text()
    });
    return message.prepareMessage();
  }

  // Sign in with ethereum flow. Need to auth users so we know the signer is who they claim to be.
  const signInWithEthereum = async (triggerFormOnSuccess: boolean) => {
    const signer = library?.getSigner();
    const message = await createSiweMessage(
        await signer?.getAddress(),
        'Sign in with Ethereum to the app.'
    );
    const signature = await signer?.signMessage(message);

    const res = await fetch(`${HOST}/auth`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include'
    });

    if(res.status !== 200) {
      console.log('Unauthorized')
      return;
    }

    const data = await res.json();

    if (data?.type === 'SIGN_IN_SUCCESS') {
      setLoggedIn(true);
      if (triggerFormOnSuccess) {
        alert('Authenticated: Now Show Create Idea Form');
      }
    }
  }


  // set to true for testing
  const hasNouns = true || connectedAccountNounVotes  > 0

  return (
    <div>
      <div>
        <h3 className={classes.heading}>Ideas</h3>
        {account !== undefined && hasNouns ? (
          <div className={classes.submitIdeaButtonWrapper}>
            <Button className={classes.generateBtn} onClick={() => !loggedIn ? signInWithEthereum(true) : alert('Create Idea Form')}>
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
        ideas
          .map((idea: any, i) => {
            const {created_by: createdBy, title, tldr, upvotes } = idea.data
            const id = getIdeaId(idea);
            return (
              <div
                className={classes.ideaLink}
                onClick={() => console.log(`Open new page for ${id}`)}
                key={id}
              >
                <span className={classes.ideaTitle}>
                  <span className={classes.titleSpan}>{title}</span> <span className={classes.likeSpan}>Upvotes: {upvotes.length}</span>
                </span>
                {Boolean(tldr) && (
                  <span className={classes.tldr}>
                    <span dangerouslySetInnerHTML={{__html: tldr}} />
                  </span>
                )}
                <span className={classes.metaData}>
                  <span className={classes.userDetails}>{createdBy}</span>
                  <span className={classes.linkDiscourse}>See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} /></span>
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
