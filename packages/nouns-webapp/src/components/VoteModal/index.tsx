import { Button, FloatingLabel, FormControl, Spinner } from 'react-bootstrap';
import SolidColorBackgroundModal from '../SolidColorBackgroundModal';
import classes from './VoteModal.module.css';
import { useCastVote, useCastVoteWithReason, Vote } from '../../wrappers/nounsDao';
import { useCallback, useEffect, useState } from 'react';
import { TransactionStatus } from '@usedapp/core';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';

interface VoteModalProps {
  show: boolean;
  onHide: () => void;
  proposalId: string | undefined;
  availableVotes: number;
}

const POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS = 3000;

const VoteModal = ({ show, onHide, proposalId, availableVotes }: VoteModalProps): JSX.Element => {
  const { castVote, castVoteState } = useCastVote();
  const { castVoteWithReason, castVoteWithReasonState } = useCastVoteWithReason();
  const [vote, setVote] = useState<Vote>();
  const [voteReason, setVoteReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoteSucessful, setIsVoteSuccessful] = useState(false);
  const [isVoteFailed, setIsVoteFailed] = useState(false);
  const [failureCopy, setFailureCopy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getVoteErrorMessage = (error: string | undefined) => {
    if (error?.match(/voter already voted/)) {
      return 'User Already Voted';
    }
    return error;
  };

  const handleVoteStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        setIsVoteSuccessful(true);
        break;
      case 'Fail':
        setFailureCopy('Transaction Failed');
        setErrorMessage(state?.errorMessage || 'Please try again.');
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
      case 'Exception':
        setFailureCopy('Error');
        setErrorMessage(getVoteErrorMessage(state?.errorMessage) || 'Please try again.');
        setIsLoading(false);
        setIsVoteFailed(true);
        break;
    }
  }, []);

  // Cast vote transaction state hook
  useEffect(() => {
    handleVoteStateChange(castVoteState);
  }, [castVoteState, handleVoteStateChange]);

  // Cast vote with reason transaction state hook
  useEffect(() => {
    handleVoteStateChange(castVoteWithReasonState);
  }, [castVoteWithReasonState, handleVoteStateChange]);

  // Auto close the modal after a transaction completes succesfully
  // Leave failed transaction up until user closes manually to allow for debugging
  useEffect(() => {
    if (isVoteSucessful) {
      setTimeout(onHide, POST_SUCESSFUL_VOTE_MODAL_CLOSE_TIME_MS);
    }
  }, [isVoteSucessful, onHide]);

  // If show is false (i.e. on hide) reset failure related state variables
  useEffect(() => {
    if (show) {
      return;
    }
    setIsVoteFailed(false);
  }, [show]);

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
          <p>You've successfully voted on on prop {proposalId}</p>

          <div className={classes.voteSuccessBody}>Thank you for voting.</div>
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
          <div onClick={() => setVote(Vote.FOR)}>
            <NavBarButton
              buttonText={'For'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.FOR_VOTE_SUBMIT}
              className={
                vote === Vote.FOR ? '' : vote === undefined ? classes.inactive : classes.unselected
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.AGAINST)}>
            <NavBarButton
              buttonText={'Against'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.AGAINST_VOTE_SUBMIT}
              className={
                vote === Vote.AGAINST
                  ? ''
                  : vote === undefined
                  ? classes.inactive
                  : classes.unselected
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(Vote.ABSTAIN)}>
            <NavBarButton
              buttonText={'Abstain'}
              buttonIcon={<></>}
              buttonStyle={NavBarButtonStyle.ABSTAIN_VOTE_SUBMIT}
              className={
                vote === Vote.ABSTAIN
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
              placeholder={`Reason for voting ${Vote[vote ?? Vote.FOR]}`}
              value={voteReason}
              onChange={e => setVoteReason(e.target.value)}
              className={classes.voteReasonTextarea}
            />
          </FloatingLabel>
          <br />
          <Button
            onClick={() => {
              if (vote === undefined || !proposalId || isLoading) {
                return;
              }
              setIsLoading(true);
              if (voteReason.trim() === '') {
                castVote(proposalId, vote);
              } else {
                castVoteWithReason(proposalId, vote, voteReason);
              }
            }}
            className={vote === undefined ? classes.submitBtnDisabled : classes.submitBtn}
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
      <SolidColorBackgroundModal
        show={show}
        onDismiss={resetNonSuccessStateAndHideModal}
        content={voteModalContent}
      />
    </>
  );
};
export default VoteModal;
