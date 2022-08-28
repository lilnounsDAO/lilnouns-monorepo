import { Button, Spinner } from 'react-bootstrap';
import Modal from '../Modal';
import classes from './SnapshotVoteModal.module.css';
import { useCallback, useEffect, useState } from 'react';
import { TransactionStatus, useEthers } from '@usedapp/core';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';
import { SnapshotProposal } from '../Proposals';
import snapshot from '@snapshot-labs/snapshot.js';
import { ethers } from 'ethers';

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

const SnapshotVoteModalModal = ({
  show,
  onHide,
  proposalId,
  availableVotes,
  snapshotProposal,
}: SnapshotVoteModalProps): JSX.Element => {
  const hub = 'https://hub.snapshot.org';
  const client = new snapshot.Client712(hub);

  const { library, account } = useEthers();
  const providers = new ethers.providers.Web3Provider(library?.provider!);

  const [vote, setVote] = useState<SnapshotVote>();

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

  async function snapVote(proposalSnapshotId: string, vote: number) {
    // console.log(`proposalSnapshotId: ${proposalSnapshotId}`)
    return await client
      .vote(new ethers.providers.Web3Provider(library?.provider!), account!, {
        space: 'leagueoflils.eth',
        proposal: proposalSnapshotId,
        type: 'single-choice',
        choice: vote,
        app: 'snapshot',
      })
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
              buttonText={`Cast ${availableVotes} ${
                availableVotes > 1 ? 'votes' : 'vote'
              } for Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === SnapshotVote.FOR
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(SnapshotVote.AGAINST)}>
            <NavBarButton
              buttonText={`Cast ${availableVotes} ${
                availableVotes > 1 ? 'votes' : 'vote'
              } against Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === SnapshotVote.AGAINST
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <div onClick={() => setVote(SnapshotVote.ABSTAIN)}>
            <NavBarButton
              buttonText={`Abstain from voting on Prop ${proposalId} `}
              buttonIcon={<></>}
              buttonStyle={
                vote === SnapshotVote.ABSTAIN
                  ? NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT
                  : NavBarButtonStyle.WHITE_INFO
              }
            />
          </div>
          <br />
          <Button
            onClick={async () => {
              if (vote === undefined || !proposalId || isLoading) {
                return;
              }
              setIsLoading(true);

              return await snapVote(snapshotProposal.id, vote);
            }}
            className={classes.submitBtn}
          >
            {isLoading ? <Spinner animation="border" /> : 'Submit Vote'}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      {show && (
        <Modal
          onDismiss={onHide}
          title={`Vote on Prop ${proposalId}`}
          content={voteModalContent}
        />
      )}
    </>
  );
};
export default SnapshotVoteModalModal;
