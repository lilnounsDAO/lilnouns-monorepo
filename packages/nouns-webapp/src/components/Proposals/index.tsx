import { Proposal, ProposalState, useProposalThreshold } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useHistory } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useNounTokenBalance, useUserDelegatee, useUserVotes } from '../../wrappers/nounToken';
import { ClockIcon } from '@heroicons/react/solid';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import DelegationModal from '../DelegationModal';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
dayjs.extend(relativeTime);

const getCountdownCopy = (
  proposal: Proposal,
  currentBlock: number,
  propState?: ProposalState,
  snapshotProp?: SnapshotProposal,
) => {
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (
    snapshotProp &&
    (propState == ProposalState.METAGOV_ACTIVE || propState == ProposalState.METAGOV_CLOSED)
  ) {
    const snapshotPropEndDate = dayjs.unix(snapshotProp.end);
    const snapshotPropStartDate = dayjs.unix(snapshotProp.start);

    if (snapshotPropStartDate?.isBefore(now) && snapshotPropEndDate?.isAfter(now)) {
      return `Lil Nouns Voting Ends ${snapshotPropEndDate.fromNow()}`;
    }
    if (snapshotPropEndDate?.isBefore(now)) {
      return `Nouns Voting Ends ${endDate?.fromNow()}`;
    }
    return `Lil Nouns Voting Starts ${snapshotPropStartDate.fromNow()}`;
  }

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return `Ends ${endDate.fromNow()}`;
  }
  if (endDate?.isBefore(now)) {
    return `Expires ${expiresDate.fromNow()}`;
  }
  return `Starts ${dayjs(startDate).fromNow()}`;
};

export enum Vote_ {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export enum ProposalState_ {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELLED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
  VETOED,
}

export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  state: 'active' | 'closed' | 'pending';
  choices: 'For' | 'Against' | 'Abstain';
  start: number;
  end: number;
  snapshot: string;
  author: string; //proposer
  proposalNo: number;

  scores_total: number;
  scores: number[];

  transactionHash: string;
  [key: string]: any;
}

const Proposals = ({
  proposals,
  nounsDAOProposals,
  snapshotProposals,
  isNounsDAOProp,
}: {
  proposals: Proposal[];
  nounsDAOProposals: Proposal[];
  snapshotProposals: SnapshotProposal[] | null;
  isNounsDAOProp: boolean;
}) => {
  const history = useHistory();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;
  const currentBlock = useBlockNumber();
  const isMobile = isMobileScreen();
  const [showDelegateModal, setShowDelegateModal] = useState(false);

  const threshold = (useProposalThreshold() ?? 0) + 1;
  const hasEnoughVotesToPropose = account !== undefined && connectedAccountNounVotes >= threshold;
  const hasNounBalance = (useNounTokenBalance(account || undefined) ?? 0) > 0;
  const userDelegatee = useUserDelegatee();
  const hasDelegatedVotes = account !== undefined && userDelegatee != account;

  const nullStateCopy = () => {
    if (account !== null) {
      if (connectedAccountNounVotes > 0) {
        return hasDelegatedVotes
          ? 'Your votes have been delegated'
          : `Making a proposal requires ${threshold} votes`;
      }

      return 'You have no Votes.';
    }
    return 'Connect wallet to make a proposal.';
  };

  return (
    <>
      {!isNounsDAOProp ? (
        <div className={classes.proposals}>
          {showDelegateModal && <DelegationModal onDismiss={() => setShowDelegateModal(false)} />}
          <div
            className={clsx(
              classes.headerWrapper,
              !hasEnoughVotesToPropose ? classes.forceFlexRow : '',
            )}
          >
            <h3 className={classes.heading}>Proposals</h3>
            {hasEnoughVotesToPropose ? (
              <div className={classes.nounInWalletBtnWrapper}>
                <div className={classes.submitProposalButtonWrapper}>
                  <Button
                    className={classes.generateBtn}
                    onClick={() => history.push('create-proposal')}
                  >
                    Submit Proposal
                  </Button>
                </div>

                {hasNounBalance && (
                  <div className={classes.delegateBtnWrapper}>
                    <Button
                      className={classes.changeDelegateBtn}
                      onClick={() => setShowDelegateModal(true)}
                    >
                      Delegate
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={clsx('d-flex', classes.nullStateSubmitProposalBtnWrapper)}>
                {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
                <div className={classes.nullBtnWrapper}>
                  <Button className={classes.generateBtnDisabled}>Submit Proposal</Button>
                </div>
                {!isMobile && hasNounBalance && (
                  <div className={classes.delegateBtnWrapper}>
                    <Button
                      className={classes.changeDelegateBtn}
                      onClick={() => setShowDelegateModal(true)}
                    >
                      {!hasDelegatedVotes ? 'Delegate' : 'Update Delegate'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          {isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
          {isMobile && hasNounBalance && (
            <div>
              <Button
                className={classes.changeDelegateBtn}
                onClick={() => setShowDelegateModal(true)}
              >
                {!hasDelegatedVotes ? 'Delegate' : 'Update Delegate'}
              </Button>
            </div>
          )}
          {proposals?.length ? (
            proposals
              .slice(0)
              .reverse()
              .map((p, i) => {
                const isPropInStateToHaveCountDown =
                  p.status === ProposalState.PENDING ||
                  p.status === ProposalState.ACTIVE ||
                  p.status === ProposalState.QUEUED;

                const countdownPill = (
                  <div className={classes.proposalStatusWrapper}>
                    <div
                      className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}
                    >
                      <div className={classes.countdownPillContentWrapper}>
                        <span className={classes.countdownPillClock}>
                          <ClockIcon height={16} width={16} />
                        </span>{' '}
                        <span className={classes.countdownPillText}>
                          {getCountdownCopy(p, currentBlock || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <a
                    className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                    href={`/vote/${p.id}`}
                    key={i}
                  >
                    <div className={classes.proposalInfoWrapper}>
                      <span className={classes.proposalTitle}>
                        <span className={classes.proposalId}>{p.id}</span> <span>{p.title}</span>
                      </span>

                      {isPropInStateToHaveCountDown && (
                        <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                      )}
                      <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                        <ProposalStatus status={p.status}></ProposalStatus>
                      </div>
                    </div>

                    {isPropInStateToHaveCountDown && (
                      <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                    )}
                  </a>
                );
              })
          ) : (
            <Alert variant="secondary">
              <Alert.Heading>No proposals found</Alert.Heading>
              <p>Proposals submitted by community members will appear here.</p>
            </Alert>
          )}
        </div>
      ) : (
        <div className={classes.proposals}>
          {showDelegateModal && <DelegationModal onDismiss={() => setShowDelegateModal(false)} />}
          <div
            className={clsx(
              classes.headerWrapper,
              !hasEnoughVotesToPropose ? classes.forceFlexRow : '',
            )}
          >
            <h3 className={classes.heading}>Proposals</h3>
          </div>
          {nounsDAOProposals?.length && snapshotProposals?.length ? (
            nounsDAOProposals
              .slice(0)
              .reverse()
              .map((p, i) => {
                const snapshotVoteObject = snapshotProposals.find(spi =>
                  spi.body.includes(p.transactionHash),
                );

                let propStatus = p.status;

                if (snapshotVoteObject && !p.snapshotForCount) {
                  p.snapshotProposalId = snapshotVoteObject.id;

                  if (snapshotVoteObject.scores_total) {
                    const scores = snapshotVoteObject.scores;
                    p.snapshotForCount == scores[0];
                    p.snapshotAgainstCount == scores[1];
                    p.snapshotAbstainCount == scores[2];
                  }

                  switch (snapshotVoteObject.state) {
                    case 'active':
                      p.snapshotEnd = snapshotVoteObject.end;
                      if (p.status == ProposalState.PENDING || p.status == ProposalState.ACTIVE) {
                        propStatus = ProposalState.METAGOV_ACTIVE;
                      } else {
                        propStatus = p.status;
                      }

                      break;

                    case 'closed':
                      if (p.status == ProposalState.ACTIVE) {
                        propStatus = ProposalState.METAGOV_CLOSED;
                        break;
                      }
                      propStatus = p.status;
                      break;

                    case 'pending':
                      propStatus = ProposalState.PENDING;
                      break;

                    default:
                      propStatus = p.status;
                      break;
                  }
                } else if (!snapshotVoteObject) {
                  if (p.status == ProposalState.ACTIVE) {
                    propStatus = ProposalState.METAGOV_PENDING;
                  } else {
                    propStatus = p.status;
                  }
                }

                const isPropInStateToHaveCountDown =
                  propStatus === ProposalState.PENDING ||
                  propStatus === ProposalState.METAGOV_ACTIVE ||
                  propStatus === ProposalState.METAGOV_CLOSED ||
                  propStatus === ProposalState.ACTIVE ||
                  propStatus === ProposalState.QUEUED;

                //if lil nouns vote is active, change countdown pill to reflect snapshot voting window

                const countdownPill = (
                  <div className={classes.proposalStatusWrapper}>
                    <div
                      className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}
                    >
                      <div className={classes.countdownPillContentWrapper}>
                        <span className={classes.countdownPillClock}>
                          <ClockIcon height={16} width={16} />
                        </span>{' '}
                        <span className={classes.countdownPillText}>
                          {getCountdownCopy(p, currentBlock || 0, propStatus, snapshotVoteObject)}
                        </span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <a
                    className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                    href={`/vote/nounsdao/${p.id}`}
                    key={i}
                  >
                    <div className={classes.proposalInfoWrapper}>
                      <span className={classes.proposalTitle}>
                        <span className={classes.proposalId}>{p.id}</span> <span>{p.title}</span>
                      </span>

                      {isPropInStateToHaveCountDown && (
                        <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                      )}
                      <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                        <ProposalStatus status={propStatus}></ProposalStatus>
                      </div>
                    </div>

                    {isPropInStateToHaveCountDown && (
                      <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                    )}
                  </a>
                );
              })
          ) : (
            <Alert variant="secondary">
              <Alert.Heading>No proposals found</Alert.Heading>
              <p>Proposals submitted by community members will appear here.</p>
            </Alert>
          )}
        </div>
      )}
    </>
  );
};
export default Proposals;
