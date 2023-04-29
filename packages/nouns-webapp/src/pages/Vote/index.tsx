import { Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  useExecuteProposal,
  useProposal,
  useQueueProposal,
  useCancelProposal,
  useCurrentQuorum,
} from '../../wrappers/nounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './Vote.module.css';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import { TransactionStatus, useBlockNumber, useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import VoteModal from '../../components/VoteModal';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import clsx from 'clsx';
import ProposalHeader from '../../components/ProposalHeader';
import ProposalContent from '../../components/ProposalContent';
import VoteCard, { VoteCardVariant } from '../../components/VoteCard';
import { useQuery } from '@apollo/client';
import {
  proposalVotesQuery,
  ProposalVotes,
  Delegates,
  propUsingDynamicQuorum,
  delegateLilNounsAtBlockQuery,
} from '../../wrappers/subgraph';
import { getNounVotes } from '../../utils/getNounsVotes';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import ReactTooltip from 'react-tooltip';
import { SearchIcon } from '@heroicons/react/solid';
import DynamicQuorumInfoModal from '../../components/DynamicQuorumInfoModal';
import config from '../../config';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const VotePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const { proposal } = useProposal(id);
  const { account } = useEthers();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [showDynamicQuorumInfoModal, setShowDynamicQuorumInfoModal] = useState<boolean>(false);
  const [isDelegateView, setIsDelegateView] = useState(false);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);
  const [isCancelPending, setCancelPending] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const {
    data: dqInfo,
    loading: loadingDQInfo,
    error: dqError,
  } = useQuery(propUsingDynamicQuorum(id ?? '0'), {
    context: { clientName: 'LilNounsDAO' },
    skip: !proposal,
  });

  const { queueProposal, queueProposalState } = useQueueProposal();
  const { executeProposal, executeProposalState } = useExecuteProposal();
  const { cancelProposal, cancelProposalState } = useCancelProposal();

  // Get and format date from data
  const timestamp = Date.now();
  const currentBlock = useBlockNumber();
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
  const now = dayjs();

  // Get total votes and format percentages for UI
  const totalVotes = proposal
    ? proposal.forCount + proposal.againstCount + proposal.abstainCount
    : undefined;
  const forPercentage = proposal && totalVotes ? (proposal.forCount * 100) / totalVotes : 0;
  const againstPercentage = proposal && totalVotes ? (proposal.againstCount * 100) / totalVotes : 0;
  const abstainPercentage = proposal && totalVotes ? (proposal.abstainCount * 100) / totalVotes : 0;

  // Only count available votes as of the proposal created block
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined);

  const currentQuorum = useCurrentQuorum(
    config.addresses.nounsDAOProxy,
    proposal && proposal.id ? parseInt(proposal.id) : 0,
    dqInfo && dqInfo.lilnounsprop ? dqInfo.lilnounsprop.quorumCoefficient === '0' : true,
  );
  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;

  const isQueued = proposal?.status === ProposalState.QUEUED;
  const isActive = proposal?.status === ProposalState.ACTIVE;
  const isPending = proposal?.status === ProposalState.PENDING;

  const isCancellable =
    (isQueued || isActive || isPending) &&
    proposal?.proposer?.toLowerCase() === account?.toLowerCase();

  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
    }
    return false;
  };

  const isAwaitingDesctructiveStateChange = () => {
    if (isCancellable) {
      return true;
    }
    return false;
  };

  const startOrEndTimeCopy = () => {
    if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
      return 'Ends';
    }
    if (endDate?.isBefore(now)) {
      return 'Ended';
    }
    return 'Starts';
  };

  const startOrEndTimeTime = () => {
    if (!startDate?.isBefore(now)) {
      return startDate;
    }
    return endDate;
  };

  const moveStateButtonAction = hasSucceeded ? 'Queue' : 'Execute';
  const moveStateAction = (() => {
    if (hasSucceeded) {
      return () => {
        if (proposal?.id) {
          return queueProposal(proposal.id);
        }
      };
    }
    return () => {
      if (proposal?.id) {
        return executeProposal(proposal.id);
      }
    };
  })();

  const desctructiveStateButtonAction = isCancellable ? 'Cancel' : '';
  const desctructiveStateAction = (() => {
    if (isCancellable) {
      return () => {
        if (proposal?.id) {
          return cancelProposal(proposal.id);
        }
      };
    }
  })();

  //* TODO: Vote Reason Buttons
  const [descriptionButtonActive, setDescriptionButtonActive] = useState('1');
  const [isPropVotesToggled, setIsPropVotesToggled] = useState(false);

  function setPropDescription() {
    setDescriptionButtonActive('1');
    setIsPropVotesToggled(false);
    window.history.pushState({}, 'Lil Nouns DAO', `/vote/${proposal?.id}/description`);
  }

  function setPropVotes() {
    setDescriptionButtonActive('2');
    setIsPropVotesToggled(true);
    window.history.pushState({}, 'Lil Nouns DAO', `/vote/${proposal?.id}/votes`);
  }

  const location = useLocation();

  useEffect(() => {
    if (!location.pathname) return;

    if (location.pathname.includes('votes')) {
      setDescriptionButtonActive('2');
      setIsPropVotesToggled(true);
    }
  }, []);

  const onTransactionStateChange = useCallback(
    (
      tx: TransactionStatus,
      successMessage?: string,
      setPending?: (isPending: boolean) => void,
      getErrorMessage?: (error?: string) => string | undefined,
      onFinalState?: () => void,
    ) => {
      switch (tx.status) {
        case 'None':
          setPending?.(false);
          break;
        case 'Mining':
          setPending?.(true);
          break;
        case 'Success':
          setModal({
            title: 'Success',
            message: successMessage || 'Transaction Successful!',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Fail':
          setModal({
            title: 'Transaction Failed',
            message: tx?.errorMessage || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
        case 'Exception':
          setModal({
            title: 'Error',
            message: getErrorMessage?.(tx?.errorMessage) || 'Please try again.',
            show: true,
          });
          setPending?.(false);
          onFinalState?.();
          break;
      }
    },
    [setModal],
  );

  useEffect(
    () => onTransactionStateChange(queueProposalState, 'Proposal Queued!', setQueuePending),
    [queueProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(executeProposalState, 'Proposal Executed!', setExecutePending),
    [executeProposalState, onTransactionStateChange, setModal],
  );

  useEffect(
    () => onTransactionStateChange(cancelProposalState, 'Proposal Canceled!', setCancelPending),
    [cancelProposalState, onTransactionStateChange, setModal],
  );

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const {
    loading: votesLoading,
    error: votesError,
    data: voters,
  } = useQuery<ProposalVotes>(proposalVotesQuery(proposal?.id ?? '0'));

  const voterIds = voters?.votes?.map(v => v.voter.id);
  const {
    loading: delegatesLoading,
    error: delegatesError,
    data: delegateSnapshot,
  } = useQuery<Delegates>(delegateLilNounsAtBlockQuery(voterIds ?? [], proposal?.createdBlock!), {
    skip: !voters?.votes?.length,
  });
  const loading = votesLoading || delegatesLoading;
  const error = votesError || delegatesError;

  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});

  const data = voters?.votes?.map(v => ({
    reason: v.reason ?? '',
    delegate: v.voter.id,
    supportDetailed: v.supportDetailed,
    delegatedVotes: delegates?.find(d => d.id === v.voter.id)?.delegatedVotes ?? '0',
    nounsRepresented: delegateToNounIds?.[v.voter.id] ?? [],
  }));

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  if (!proposal || loading || !data || loadingDQInfo) {
    return (
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  const isWalletConnected = !(activeAccount === undefined);
  const isActiveForVoting = startDate?.isBefore(now) && endDate?.isAfter(now);

  const forNouns = getNounVotes(data, 1);
  const againstNouns = getNounVotes(data, 0);
  const abstainNouns = getNounVotes(data, 2);
  const isV2Prop = dqInfo.lilnounsprop.quorumCoefficient > 0;

  if (error || dqError) {
    return <>{'Failed to fetch'}</>;
  }

  return (
    <Section fullWidth={false} className={classes.votePage}>
      {showDynamicQuorumInfoModal && (
        <DynamicQuorumInfoModal
          proposal={proposal}
          isNounsDAOProp={false}
          againstVotesAbsolute={againstNouns.length}
          onDismiss={() => setShowDynamicQuorumInfoModal(false)}
        />
      )}
      <VoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        proposalId={proposal?.id}
        availableVotes={availableVotes || 0}
      />
      <Col lg={10} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            proposal={proposal}
            isActiveForVoting={isActiveForVoting}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => setShowVoteModal(true)}
            isShowVoteModalOpen={showVoteModal}
          />
        )}
      </Col>
      <Col lg={10} className={clsx(classes.proposal, classes.wrapper)}>
        {(isAwaitingStateChange() || isAwaitingDesctructiveStateChange()) && (
          <Row className={clsx(classes.section, classes.transitionStateButtonSection)}>
            <Col className="d-grid gap-4">
              {isAwaitingStateChange() && (
                <Button
                  onClick={moveStateAction}
                  disabled={isQueuePending || isExecutePending}
                  variant="dark"
                  className={classes.transitionStateButton}
                >
                  {isQueuePending || isExecutePending ? (
                    <Spinner animation="border" />
                  ) : (
                    `${moveStateButtonAction} Proposal ⌐◧-◧`
                  )}
                </Button>
              )}

              {isAwaitingDesctructiveStateChange() && (
                <Button
                  onClick={desctructiveStateAction}
                  disabled={isCancelPending}
                  variant="danger"
                  className={classes.destructiveTransitionStateButton}
                >
                  {isCancelPending ? (
                    <Spinner animation="border" />
                  ) : (
                    `${desctructiveStateButtonAction} Proposal ⌐◧-◧`
                  )}
                </Button>
              )}
            </Col>
          </Row>
        )}

        <p
          onClick={() => setIsDelegateView(!isDelegateView)}
          className={classes.toggleDelegateVoteView}
        >
          {isDelegateView ? 'Switch to Lil Noun view' : 'Switch to delegate view'}
        </p>
        <Row>
          <VoteCard
            proposal={proposal}
            percentage={forPercentage}
            nounIds={forNouns}
            variant={VoteCardVariant.FOR}
            delegateView={isDelegateView}
            delegateGroupedVoteData={data}
            lilnounIds={[]}
            isNounsDAOProp={false}
          />
          <VoteCard
            proposal={proposal}
            percentage={againstPercentage}
            nounIds={againstNouns}
            variant={VoteCardVariant.AGAINST}
            delegateView={isDelegateView}
            delegateGroupedVoteData={data}
            lilnounIds={[]}
            isNounsDAOProp={false}
          />
          <VoteCard
            proposal={proposal}
            percentage={abstainPercentage}
            nounIds={abstainNouns}
            variant={VoteCardVariant.ABSTAIN}
            delegateView={isDelegateView}
            delegateGroupedVoteData={data}
            lilnounIds={[]}
            isNounsDAOProp={false}
          />
        </Row>

        {/* TODO abstract this into a component  */}
        <Row>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <div className={classes.voteMetadataRow}>
                  <div className={classes.voteMetadataRowTitle}>
                    <h1>Threshold</h1>
                  </div>
                  {isV2Prop && (
                    <ReactTooltip
                      id={'view-dq-info'}
                      className={classes.delegateHover}
                      getContent={dataTip => {
                        return <a>View Dynamic Threshold Info</a>;
                      }}
                    />
                  )}
                  <div
                    data-for="view-dq-info"
                    data-tip="View Dynamic Quorum Info"
                    onClick={() => setShowDynamicQuorumInfoModal(true && isV2Prop)}
                    className={clsx(classes.thresholdInfo, isV2Prop ? classes.cursorPointer : '')}
                  >
                    <span>
                      {isV2Prop ? 'Threshold' : isV2Prop ? 'Current Threshold' : 'Threshold'}
                    </span>
                    <h3>
                      {isV2Prop ? currentQuorum ?? 0 : proposal.quorumVotes} votes
                      {isV2Prop && <SearchIcon className={classes.dqIcon} />}
                    </h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <Row className={classes.voteMetadataRow}>
                  <Col className={classes.voteMetadataRowTitle}>
                    <h1>{startOrEndTimeCopy()}</h1>
                  </Col>
                  <Col className={classes.voteMetadataTime}>
                    <span>{startOrEndTimeTime() && startOrEndTimeTime()?.format('h:mm A z')}</span>
                    <h3>{startOrEndTimeTime() && startOrEndTimeTime()?.format('MMM D, YYYY')}</h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={12}>
            <Card className={classes.voteInfoCard}>
              <Card.Body className="p-2">
                <Row className={classes.voteMetadataRow}>
                  <Col className={classes.voteMetadataRowTitle}>
                    <h1>Snapshot</h1>
                  </Col>
                  <Col className={classes.snapshotBlock}>
                    <span>Taken at block</span>
                    <h3>{proposal.createdBlock}</h3>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className={classes.section}>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-start align-items-start">
                <h5>{isPropVotesToggled ? 'Votes' : 'Description'}</h5>
              </div>

              <div className="d-flex justify-content-end align-items-end">
                <div className="btn-toolbar" role="btn-toolbar" aria-label="Basic example">
                  <Button
                    key={1}
                    className={
                      descriptionButtonActive === '1'
                        ? classes.governanceSwitchBtnActive
                        : classes.governanceSwitchBtn
                    }
                    id={'1'}
                    onClick={e => setPropDescription()}
                  >
                    Description
                  </Button>
                  <Button
                    key={2}
                    className={
                      descriptionButtonActive === '2'
                        ? classes.governanceSwitchBtn2Active
                        : classes.governanceSwitchBtn2
                    }
                    onClick={e => setPropVotes()}
                  >
                    Votes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProposalContent proposal={proposal} isVotesToggled={isPropVotesToggled} votes={data} />
      </Col>
    </Section>
  );
};

export default VotePage;
