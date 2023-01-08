import classes from './ProposalTableHorizontal.module.css';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import { Proposal, ProposalState } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { ClockIcon } from '@heroicons/react/solid';
import { useBlockNumber } from '@usedapp/core';
import { Col } from 'react-bootstrap';
import { getCountdownCopy } from '../Proposals';

export const ProposalRow = ({ proposal }: { proposal: Proposal }) => {
  const currentBlock = useBlockNumber();

  const isPropInStateToHaveCountDown =
    proposal.status === ProposalState.PENDING ||
    proposal.status === ProposalState.ACTIVE ||
    proposal.status === ProposalState.QUEUED;

  const countdownPill = (
    <div className={classes.proposalStatusWrapper}>
      <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
        <div className={classes.countdownPillContentWrapper}>
          <span className={classes.countdownPillClock}>
            <ClockIcon height={16} width={16} />
          </span>{' '}
          <span className={classes.countdownPillText}>
            {getCountdownCopy(proposal, currentBlock || 0)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <a
        className={clsx(classes.activeproposalLink, classes.proposalLinkWithCountdown)}
        href={`/vote/${proposal.id}`}
        key={proposal.id}
      >
        <div className={classes.activeProposalInfoWrapper}>
          <span className={classes.activeProposalTitle}>
            <span className={classes.proposalId}>{proposal.id}</span>
            <span>{proposal.title}</span>
          </span>

          {isPropInStateToHaveCountDown && (
            <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
          )}
          {/* <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
            <ProposalStatus status={proposal.status}></ProposalStatus>
          </div> */}
        </div>

        {isPropInStateToHaveCountDown && (
          <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
        )}
      </a>
    </>
  );
};

const ProposalTableHorizontal = ({ proposals }: { proposals: Proposal[] }) => {
  return (
    <>
      {proposals?.length ? (
        <div className={classes.activeProposalCard}>
          <Col lg={12} style={{ columnGap: 0 }}>
            <span className={classes.subHeaderRow}>Proposals waiting for your vote.</span>
          </Col>
          <Col lg={12} style={{ columnGap: 0 }}>
            <div className={classes.activeProposalSection}>
              {proposals
                .slice(0)
                .reverse()
                // .filter((a) => a.status !== ProposalState.ACTIVE)
                .map(p => (
                  <ProposalRow proposal={p} key={p.id} />
                ))}
            </div>
          </Col>
          <br />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProposalTableHorizontal;
