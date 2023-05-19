import { Button, FloatingLabel, FormControl, Spinner } from 'react-bootstrap';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import classes from './SnapshotVoteModal.module.css';
import { useCallback, useEffect, useState } from 'react';
import { TransactionStatus, useEthers } from '@usedapp/core';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';
import { SnapshotProposal } from '../Proposals';
import snapshot from '@snapshot-labs/snapshot.js';
import { ethers } from 'ethers';
import { Vote as SnapshotVoteType } from '@snapshot-labs/snapshot.js/dist/sign/types';

interface SnapshotVoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
  snapshotProposal: SnapshotProposal;
}

export enum SnapshotVote {
  FOR = 1,
  AGAINST = 2,
  ABSTAIN = 3,
}

const POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS = 5000;

const SnapshotVoteModal = ({
  show,
  onHide,
  proposalId,
  availableVotes,
  snapshotProposal,
}: SnapshotVoteModalProps): JSX.Element => {
  const hub = 'https://hub.snapshot.org';
  const client = new snapshot.Client712(hub);

  const { library, account } = useEthers();

  const [vote, setVote] = useState<SnapshotVote>();
  const [voteReason, setVoteReason] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isVoteSucessful, setIsVoteSuccessful] = useState(false);
  const [isVoteFailed, setIsVoteFailed] = useState(false);
  const [failureCopy, setFailureCopy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function snapVote(proposalSnapshotId: string, vote: number, voteReason?: string) {

    const voteObject: SnapshotVoteType = {
      space: 'leagueoflils.eth',
      proposal: proposalSnapshotId,
      type: 'single-choice',
      choice: vote,
      app: 'snapshot',
    };

    if (voteReason) {
      voteObject.reason = voteReason;
    }

    return await client
      .vote(new ethers.providers.Web3Provider(library?.provider!), account!, voteObject)
      .then(res => {
        // console.log(`snapVote response ${JSON.stringify(res)}`);
        setIsLoading(false);
        setIsVoteSuccessful(true);

        return;
      })
      .catch(err => {
        // console.log(`snapVote error ${JSON.stringify(err)}`);
        setFailureCopy('Error');
        setErrorMessage('Please try again.');
        setIsLoading(false);
        setIsVoteFailed(true);
        return;
      });
  }

  // Auto close the modal after a transaction completes succesfully
  // Leave failed transaction up until user closes manually to allow for debugging
  // useEffect(() => {
  //   if (isVoteSucessful) {
  //     setTimeout(onHide, POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS);
  //   }
  // }, [isVoteSucessful, onHide]);

  // If show is false (i.e. on hide) reset failure related state variables
  useEffect(() => {
    if (show) {
      return;
    }
    setIsVoteFailed(false);
  }, [show]);

  const recastSnapshotVote = () => {
    setIsVoteSuccessful(false);
  };

  const voteModalContent = (
    <>
      <div className={classes.voteModalTitle}>
        <a>Vote on Prop {proposalId}</a>
      </div>
      <div className={classes.voteModalSubtitle}>
        {availableVotes === 1 ? (
          <a>
            Voting with <span className={classes.bold}>{availableVotes}</span> Lil Noun
          </a>
        ) : (
          <a>
            Voting with <span className={classes.bold}>{availableVotes}</span> Lil Nouns
          </a>
        )}
      </div>
      {isVoteSucessful && (
        <div className={classes.transactionStatus}>
          <p>You've successfully voted on prop {proposalId}</p>

          <div className={classes.voteSuccessBody}>Thank you for voting.</div>
          <br />
          <Button
            onClick={async () => {
              recastSnapshotVote();
            }}
            className={classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : 'Resubmit Vote'}
          </Button>
        </div>
      )}
      {isVoteFailed && (
        <div className={classes.transactionStatus}>
          <p className={classes.voteFailureTitle}>There was an error voting for your account.</p>
          <div className={classes.voteFailureBody}>
            {failureCopy}: <span className={classes.voteFailureErrorMessage}>{errorMessage}</span>
          </div>
        </div>
      )}
      {!isVoteFailed && !isVoteSucessful && (
        <div className={clsx(classes.votingButtonsWrapper, isLoading ? classes.disabled : '')}>
          <div onClick={() => setVote(SnapshotVote.FOR)}>
            <NavBarButton
              buttonText={'For'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.FOR_VOTE_SUBMIT}
              className={
                vote === SnapshotVote.FOR
                  ? ''
                  : vote === undefined
                  ? classes.inactive
                  : classes.unselected
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(SnapshotVote.AGAINST)}>
            <NavBarButton
              buttonText={'Against'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.AGAINST_VOTE_SUBMIT}
              className={
                vote === SnapshotVote.AGAINST
                  ? ''
                  : vote === undefined
                  ? classes.inactive
                  : classes.unselected
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(SnapshotVote.ABSTAIN)}>
            <NavBarButton
              buttonText={'Abstain'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.ABSTAIN_VOTE_SUBMIT}
              className={
                vote === SnapshotVote.ABSTAIN
                  ? ''
                  : vote === undefined
                  ? classes.inactive
                  : classes.unselected
              }
            />
          </div>
          <br />
          <FloatingLabel controlId="reasonTextarea" label="Reason (Optional)">
            <FormControl
              as="textarea"
              placeholder={`Reason for voting ${SnapshotVote[vote ?? SnapshotVote.FOR]}`}
              value={voteReason}
              onChange={e => setVoteReason(e.target.value)}
              className={classes.voteReasonTextarea}
            />
          </FloatingLabel>
          <br />
          <Button
            onClick={async () => {
              if (vote === undefined || !proposalId || isLoading) {
                return;
              }
              setIsLoading(true);

                if (voteReason.trim() === '') {
                return await snapVote(snapshotProposal.id, vote);
              } else {
                return await snapVote(snapshotProposal.id, vote, voteReason);
              }

            }}
            className={classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : 'Submit Vote'}
          </Button>
        </div>
      )}
    </>
  );

  // On modal dismiss, reset non-success state
  const resetNonSuccessStateAndHideModal = () => {
    setIsLoading(false);
    setIsVoteFailed(false);
    setErrorMessage('');
    setFailureCopy('');
    onHide();
  };

  return (
    <>
      {show && (
        <SolidColorBackgroundModal
          show={show}
          onDismiss={resetNonSuccessStateAndHideModal}
          content={voteModalContent}
        />
      )}
    </>
  );
};
export default SnapshotVoteModal;
