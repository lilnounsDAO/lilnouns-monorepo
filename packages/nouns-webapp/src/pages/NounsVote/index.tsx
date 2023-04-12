import { Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalState } from '../../wrappers/nounsDao';
import {
  useCurrentBigNounQuorum,
  useExecuteBigNounProposal,
  useBigNounProposal,
  useQueueBigNounProposal,
} from '../../wrappers/bigNounsDao';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import classes from './NounsVote.module.css';
import { RouteComponentProps } from 'react-router-dom';
import { TransactionStatus, useBlockNumber } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import SnapshotVoteModal from '../../components/SnapshotVoteModal';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import clsx from 'clsx';
import ProposalHeader from '../../components/ProposalHeader';
import ProposalContent from '../../components/ProposalContent';
import VoteCard, { VoteCardVariant } from '../../components/VoteCard';

//TODO: votes query refetch on succesfull snapshot vote.
// https://www.apollographql.com/docs/react/data/queries/#refetching

import {
  proposalVotesQuery,
  delegateNounsAtBlockQuery,
  delegateLilNounsAtBlockQuery,
  ProposalVotes,
  Delegates,
  propUsingDynamicQuorum,
  snapshotSingularProposalVotesQuery,
  snapshotProposalsQuery,
  lilNounsHeldByVoterQuery,
  bigNounPropUsingDynamicQuorum,
} from '../../wrappers/subgraph';
import { getNounVotes } from '../../utils/getNounsVotes';
import { useQuery } from '@apollo/client';
import { SnapshotProposal } from '../../components/Proposals';
// import { isMobileScreen } from '../../utils/isMobile';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import { SearchIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import DynamicQuorumInfoModal from '../../components/DynamicQuorumInfoModal';
import config from '../../config';
import { isMobileScreen } from '../../utils/isMobile';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

export interface SnapshotVoters {
  voter: string;
  vp: number;
  choice: number;
  nounIds: string[];
}

interface SnapshotProp {
  forSnapshotNounIds: string[];
  againstSnapshotNounIds: string[];
  abstainSnapshotNounIds: string[];

  snapshotPropEndDate: dayjs.Dayjs | undefined;
  snapshotPropStartDate: dayjs.Dayjs | undefined;
  propStatus: ProposalState;
  snapshotForCountAmt: number;
  snapshotAgainstCountAmt: number;
  snapshotAbstainCountAmt: number;
  snapshotVoters: SnapshotVoters[];
}

const NounsVotePage = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {
  const {proposal} = useBigNounProposal(id);

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const {
    loading,
    error,
    data: voters,
  } = useQuery<ProposalVotes>(proposalVotesQuery(proposal?.id ?? '0'), {
    context: { clientName: 'NounsDAO' },
  });

  const voterIds = voters?.votes?.map(v => v.voter.id);
  const { data: delegateSnapshot } = useQuery<Delegates>(
    delegateNounsAtBlockQuery(voterIds ?? [], proposal?.createdBlock ?? 0),
    {
      skip: !voters?.votes?.length,
      context: { clientName: 'NounsDAO' },
      //* no cache to mitigate against object mutation between lils and nouns
      fetchPolicy: 'no-cache',
    },
  );

  const { delegates } = delegateSnapshot || {};
  const delegateToNounIds = delegates?.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr.id] = curr?.nounsRepresented?.map(nr => nr.id) ?? [];
    return acc;
  }, {});

  const data = voters?.votes?.map(v => ({
    delegate: v.voter.id,
    supportDetailed: v.supportDetailed,
    nounsRepresented: delegateToNounIds?.[v.voter.id] ?? [],
  }));

  const {
    loading: snapshotProposalLoading,
    error: snapshotProposalError,
    data: snapshotProposalData,
  } = useQuery(snapshotProposalsQuery(), {
    context: { clientName: 'NounsDAOSnapshot' },
    skip: !proposal,
  });

  const {
    loading: snapshotVoteLoading,
    error: snapshotVoteError,
    data: snapshotVoteData,
  } = useQuery(
    snapshotSingularProposalVotesQuery(
      snapshotProposalData?.proposals?.find((spi: SnapshotProposal) =>
        spi.body.includes(proposal?.transactionHash ?? ''),
      ) !== undefined
        ? snapshotProposalData?.proposals?.find((spi: SnapshotProposal) =>
          spi.body.includes(proposal?.transactionHash ?? ''),
        ).id
        : '',
    ),
    {
      skip: !snapshotProposalData?.proposals?.find((spi: SnapshotProposal) =>
        spi.body.includes(proposal?.transactionHash ?? ''),
      ),
      context: { clientName: 'NounsDAOSnapshot' },
    },
  );

  const snapProp = snapshotProposalData?.proposals.find((spi: SnapshotProposal) =>
    spi.body.includes(proposal?.transactionHash ?? ''),
  );
  const { loading: lilnounsDelegatedVotesLoading, data: lilnounsDelegatedVotesData } =
    useQuery<Delegates>(
      delegateLilNounsAtBlockQuery(
        snapshotVoteData?.votes.map((a: { voter: string }) => a.voter.toLowerCase()) ?? [],
        snapProp?.snapshot ?? 0,
      ),
      {
        skip: !snapshotProposalData?.proposals?.find((spi: SnapshotProposal) =>
          spi.body.includes(proposal?.transactionHash ?? ''),
        ),
        // fetchPolicy: 'no-cache',
      },
    );

  // const isMobile = isMobileScreen();

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [showDynamicQuorumInfoModal, setShowDynamicQuorumInfoModal] = useState<boolean>(false);
  const [isDelegateView, setIsDelegateView] = useState(false);
  const [isLilNounView, setIsLilNounView] = useState(true);

  const [isQueuePending, setQueuePending] = useState<boolean>(false);
  const [isExecutePending, setExecutePending] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);
  const {
    data: dqInfo,
    loading: loadingDQInfo,
    error: dqError,
  } = useQuery(bigNounPropUsingDynamicQuorum(id ?? '0'), {
    context: { clientName: 'NounsDAO' },
    skip: !proposal,
  });

  const { queueProposal, queueProposalState } = useQueueBigNounProposal();
  const { executeProposal, executeProposalState } = useExecuteBigNounProposal();

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
  const availableVotes = !isLilNounView
    ? useUserVotesAsOfBlock(proposal?.createdBlock ?? undefined)
    : useUserVotesAsOfBlock(snapProp?.snapshot ?? undefined);

  const currentQuorum = useCurrentBigNounQuorum(
    config.bigNounsAddresses.nounsDAOProxy,
    proposal && proposal.id ? parseInt(proposal.id) : 0,
    dqInfo && dqInfo.nounsProp ? dqInfo.nounsProp.quorumCoefficient === '0' : true,
  );

  const hasSucceeded = proposal?.status === ProposalState.SUCCEEDED;
  const isAwaitingStateChange = () => {
    if (hasSucceeded) {
      return true;
    }
    if (proposal?.status === ProposalState.QUEUED) {
      return new Date() >= (proposal?.eta ?? Number.MAX_SAFE_INTEGER);
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

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  if (
    !proposal ||
    loading ||
    !data ||
    snapshotProposalLoading ||
    snapshotVoteLoading ||
    lilnounsDelegatedVotesLoading ||
    loadingDQInfo ||
    !dqInfo
  ) {
    return (
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  const forNouns = getNounVotes(data, 1);
  const againstNouns = getNounVotes(data, 0);
  const abstainNouns = getNounVotes(data, 2);
  const isV2Prop = dqInfo.nounsProp.quorumCoefficient > 0;

  if (error || snapshotProposalError || snapshotVoteError || dqError) {
    return <>{'Failed to fetch'}</>;
  }

  const isWalletConnected = !(activeAccount === undefined);
  const isActiveForVoting = !snapProp ? false : snapProp.state == 'active' ? true : false;

  const prepareSnapshot = (): SnapshotProp => {
    let propStatus = proposal.status;

    if (!snapProp) {
      const snap: SnapshotProp = {
        forSnapshotNounIds: [],
        againstSnapshotNounIds: [],
        abstainSnapshotNounIds: [],
        snapshotPropEndDate: undefined,
        snapshotPropStartDate: undefined,
        propStatus: propStatus,
        snapshotForCountAmt: 0,
        snapshotAgainstCountAmt: 0,
        snapshotAbstainCountAmt: 0,
        snapshotVoters: [],
      };

      return snap;
    }

    const snapVotes: SnapshotVoters[] = Object.values(
      snapshotVoteData?.votes.reduce((res: any, obj: SnapshotVoters, i: number) => {
        const delegatedVoterRepresentedNounIds = lilnounsDelegatedVotesData?.delegates
          .filter((d: any) => d.id === obj.voter.toLowerCase())
          .flatMap((d: any) => d.nounsRepresented)
          .map((d: any) => d.id);

        res[obj.voter] = res[obj.voter] || {
          voter: obj.voter,
          vp: obj.vp,
          choice: obj.choice,
          nounIds: delegatedVoterRepresentedNounIds,
        };

        return res;
      }, []),
    );

    switch (snapProp.state) {
      case 'active':
        if (proposal.status == ProposalState.PENDING || proposal.status == ProposalState.ACTIVE) {
          propStatus = ProposalState.METAGOV_ACTIVE;
        } else {
          propStatus = proposal.status;
        }
        break;

      case 'closed':
        if (proposal.status == ProposalState.ACTIVE) {
          propStatus = ProposalState.METAGOV_CLOSED;
          break;
        }
        propStatus = proposal.status;
        break;

      case 'pending':
        propStatus = ProposalState.PENDING;
        break;

      default:
        if (proposal.status) {
        }
        propStatus = proposal.status;
        break;
    }

    const snap: SnapshotProp = {
      forSnapshotNounIds: snapVotes.filter(opt => opt.choice == 1).flatMap(a => a.nounIds),
      againstSnapshotNounIds: snapVotes.filter(opt => opt.choice == 2).flatMap(a => a.nounIds),
      abstainSnapshotNounIds: snapVotes.filter(opt => opt.choice == 3).flatMap(a => a.nounIds),
      snapshotPropEndDate: dayjs.unix(snapProp.end),
      snapshotPropStartDate: dayjs.unix(snapProp.start),
      propStatus: propStatus,
      snapshotForCountAmt: snapProp.scores[0],
      snapshotAgainstCountAmt: snapProp.scores[1],
      snapshotAbstainCountAmt: snapProp.scores[2],
      snapshotVoters: snapVotes,
    };

    return snap;
  };

  const fetchedValues = prepareSnapshot();

  const forSnapshotNounIds = fetchedValues.forSnapshotNounIds;
  const againstSnapshotNounIds = fetchedValues.againstSnapshotNounIds;
  const abstainSnapshotNounIds = fetchedValues.abstainSnapshotNounIds;

  const snapshotPropEndDate = fetchedValues.snapshotPropEndDate;
  const snapshotPropStartDate = fetchedValues.snapshotPropStartDate;

  const snapshotStartOrEndTimeCopy = () => {
    if (snapshotPropStartDate?.isBefore(now) && snapshotPropEndDate?.isAfter(now)) {
      return 'Snapshot Ends';
    }
    if (snapshotPropEndDate?.isBefore(now)) {
      return 'Ended';
    }
    return 'Starts';
  };

  const snapshotStartOrEndTimeTime = () => {
    if (snapshotPropStartDate !== undefined) {
      if (!snapshotPropStartDate?.isBefore(now)) {
        return snapshotPropStartDate;
      }

      return snapshotPropEndDate;
    }

    return undefined;
  };

  const snapshotForCountAmt = fetchedValues.snapshotForCountAmt;
  const snapshotAgainstCountAmt = fetchedValues.snapshotAgainstCountAmt;
  const snapshotAbstainCountAmt = fetchedValues.snapshotAbstainCountAmt;

  proposal.status = fetchedValues.propStatus;

  const isMobile = isMobileScreen();

  return (
    <Section fullWidth={false} className={classes.votePage}>
      {showDynamicQuorumInfoModal && (
        <DynamicQuorumInfoModal
          proposal={proposal}
          isNounsDAOProp={true}
          againstVotesAbsolute={againstNouns.length}
          onDismiss={() => setShowDynamicQuorumInfoModal(false)}
        />
      )}
      <SnapshotVoteModal
        show={showVoteModal}
        onHide={() => setShowVoteModal(false)}
        proposalId={proposal?.id}
        snapshotProposal={snapProp}
        availableVotes={availableVotes || 0}
      />
      <Col lg={10} className={classes.wrapper}>
        {proposal && (
          <ProposalHeader
            snapshotProposal={snapProp}
            proposal={proposal}
            isNounsDAOProp={true}
            isActiveForVoting={isActiveForVoting}
            isWalletConnected={isWalletConnected}
            submitButtonClickHandler={() => setShowVoteModal(true)}
            isShowVoteModalOpen={showVoteModal}
          />
        )}
      </Col>
      <Col lg={10} className={clsx(classes.proposal, classes.wrapper)}>
        {isAwaitingStateChange() && (
          <Row className={clsx(classes.section, classes.transitionStateButtonSection)}>
            <Col className="d-grid">
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
            </Col>
          </Row>
        )}

        <p
          onClick={() => {
            
            if (isDelegateView) {
              setIsDelegateView(false);
              if (snapProp) {
                setIsLilNounView(true);
              }
            }

            if (!isDelegateView && !isLilNounView) {
              !isMobile ? setIsDelegateView(true) : setIsLilNounView(true);
            }

            if (isLilNounView) {
              setIsLilNounView(false);
            }


          }}
          className={classes.toggleVoteView}
        >
          {!snapProp
            ? isDelegateView
              ? 'Switch to Noun view'
              : 'Switch to Noun delegate view'

            : !isMobile
              ? isDelegateView
                ? 'Switch to Lil Noun view'
                : isLilNounView
                  ? 'Switch to Noun view'
                  : 'Switch to Noun delegate view'
              : isLilNounView
                ? 'Switch to Noun view'
                : 'Switch to Lil Noun view'}

          {/* {isLilNounView ? 'Switch to Noun view' : 'Switch to Lil Noun view'} */}
        </p>

        <Row>
          <VoteCard
            proposal={proposal}
            percentage={forPercentage}
            nounIds={forNouns}
            lilnounIds={forSnapshotNounIds}
            variant={VoteCardVariant.FOR}
            delegateView={isDelegateView}
            snapshotView={isLilNounView}
            delegateGroupedVoteData={data}
            isNounsDAOProp={true}
            snapshotVoteCount={snapshotForCountAmt}
          />
          <VoteCard
            proposal={proposal}
            percentage={againstPercentage}
            nounIds={againstNouns}
            lilnounIds={againstSnapshotNounIds}
            variant={VoteCardVariant.AGAINST}
            delegateView={isDelegateView}
            snapshotView={isLilNounView}
            delegateGroupedVoteData={data}
            isNounsDAOProp={true}
            snapshotVoteCount={snapshotAgainstCountAmt}
          />
          <VoteCard
            proposal={proposal}
            percentage={abstainPercentage}
            nounIds={abstainNouns}
            lilnounIds={abstainSnapshotNounIds}
            variant={VoteCardVariant.ABSTAIN}
            delegateView={isDelegateView}
            snapshotView={isLilNounView}
            delegateGroupedVoteData={data}
            isNounsDAOProp={true}
            snapshotVoteCount={snapshotAbstainCountAmt}
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
                  {!isLilNounView && isV2Prop && (
                    <ReactTooltip
                      id={'view-dq-info'}
                      className={classes.delegateHover}
                      getContent={dataTip => {
                        return <a>View Dynamic Quorum Info</a>;
                      }}
                    />
                  )}
                  <div
                    data-for="view-dq-info"
                    data-tip="View Dynamic Quorum Info"
                    onClick={() => setShowDynamicQuorumInfoModal(true && isV2Prop && !isLilNounView)}
                    className={clsx(classes.thresholdInfo, isV2Prop ? classes.cursorPointer : '')}
                  >
                    <span>
                      {isLilNounView ? 'Quorum' : isV2Prop ? 'Current Quorum' : 'Quorum'}
                    </span>
                    {isLilNounView ? (
                      <h3>N/A</h3>
                    ) : (
                      <h3>
                        {isV2Prop ? currentQuorum ?? 0 : proposal.quorumVotes} votes
                        {isV2Prop && <SearchIcon className={classes.dqIcon} />}
                      </h3>
                    )}
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
                    <h1>{!isLilNounView ? startOrEndTimeCopy() : snapshotStartOrEndTimeCopy()}</h1>
                  </Col>
                  <Col className={classes.voteMetadataTime}>
                    <span>
                      {snapshotStartOrEndTimeTime() !== undefined
                        ? !isLilNounView
                          ? startOrEndTimeTime() && startOrEndTimeTime()?.format('h:mm A z')
                          : snapshotStartOrEndTimeTime() &&
                          snapshotStartOrEndTimeTime()?.format('h:mm A z')
                        : !isLilNounView
                          ? startOrEndTimeTime() && startOrEndTimeTime()?.format('h:mm A z')
                          : 'Time'}
                    </span>
                    <h3>
                      {snapshotStartOrEndTimeTime() !== undefined
                        ? !isLilNounView
                          ? startOrEndTimeTime() && startOrEndTimeTime()?.format('MMM D, YYYY')
                          : snapshotStartOrEndTimeTime() &&
                          snapshotStartOrEndTimeTime()?.format('MMM D, YYYY')
                        : !isLilNounView
                          ? startOrEndTimeTime() && startOrEndTimeTime()?.format('MMM D, YYYY')
                          : 'N/A'}
                    </h3>
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

        <ProposalContent proposal={proposal} />
      </Col>
    </Section>
  );
};

export default NounsVotePage;
