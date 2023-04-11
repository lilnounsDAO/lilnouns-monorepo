import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import { Proposal, useHasVotedOnProposal, useProposalCount, useProposalVote } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import { useBlockTimestamp } from '../../hooks/useBlockTimestamp';
import dayjs from 'dayjs';
import { SnapshotProposal } from '../Proposals';
import { SnapshotVoters } from '../../pages/NounsVote';
import { useEthers } from '@usedapp/core';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { transactionLink } from '../ProposalContent';
import ShortAddress from '../ShortAddress';
import ProposalNavigation from '../ProposalNavigation';
import { useBigNounProposalCount } from '../../wrappers/bigNounsDao';

interface ProposalHeaderProps {
  proposal: Proposal;
  snapshotProposal?: SnapshotProposal;
  snapshotVoters?: SnapshotVoters[];
  isNounsDAOProp?: boolean;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  submitButtonClickHandler: () => void;
  isShowVoteModalOpen: boolean;
}

interface PropNavigationProps { 
  proposal: Proposal;
}

export const useHasVotedOnSnapshotProposal = (snapshotVoters: SnapshotVoters[] | undefined): boolean => {
  if(!snapshotVoters) return false;
  const { account } = useEthers();
  return snapshotVoters.flatMap(a => a.voter).includes(account?.toLowerCase() ?? "") ? true : false
};

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, /*proposalCount,*/ isActiveForVoting, isWalletConnected, submitButtonClickHandler , snapshotProposal, isNounsDAOProp, snapshotVoters, isShowVoteModalOpen} = props;
  const proposalCount = isNounsDAOProp ? useBigNounProposalCount(): useProposalCount();
  const history = useHistory();
  const isMobile = isMobileScreen();
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock) ?? 0;
  const hasVoted = !snapshotProposal && !isNounsDAOProp ? useHasVotedOnProposal(proposal?.id) : useHasVotedOnSnapshotProposal(snapshotVoters) 
  const proposalVote = useProposalVote(proposal?.id);
  const proposalCreationTimestamp = !snapshotProposal ? useBlockTimestamp(proposal?.createdBlock) : useBlockTimestamp(Number(snapshotProposal?.snapshot))
  const disableVoteButton = !isWalletConnected || !availableVotes;

  const voteButton = (
    <>
      {isWalletConnected ? (
        <>{!availableVotes && <div className={classes.noVotesText}>You have no votes.</div>}</>
      ) : (
        <div className={classes.connectWalletText}>Connect a wallet to vote.</div>
      )}
      <Button
        className={disableVoteButton ? classes.submitBtnDisabled : classes.submitBtn}
        disabled={disableVoteButton}
        onClick={submitButtonClickHandler}
      >
        Submit vote
      </Button>
    </>
  );

  const proposer = (
    <a
      href={buildEtherscanAddressLink(proposal.proposer || '')}
      target="_blank"
      rel="noreferrer"
      className={classes.proposerLinkJp}
    >
      <ShortAddress address={proposal.proposer || ''} avatar={false} />
    </a>
  );


  const proposedAtTransactionHash = (
    <>
      at{' '}
      <span className={classes.propTransactionHash}>
        {transactionLink(proposal.transactionHash)}
      </span>
    </>
  );
  const isFirstProposal: boolean = parseInt(proposal?.id ?? "0") == 1
  const isLastProposal: boolean = parseInt(proposal?.id ?? "0") == proposalCount

  const prevProposalHandler = () => {
    const path = isNounsDAOProp ? "/vote/nounsdao" : "/vote"
    history.push(`${path}/${parseInt(proposal?.id ?? "0") - 1}`);
  };
  const nextProposalHandler = () => {
    const path = isNounsDAOProp ? "/vote/nounsdao" : "/vote"
    history.push(`${path}/${parseInt(proposal?.id ?? "0") + 1}`);
  };


  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <div className={classes.headerRow}>
          <ProposalNavigation
              isFirstProposal={isFirstProposal}
              isLastProposal={isLastProposal}
              onPrevProposalClick={prevProposalHandler}
              onNextProposalClick={nextProposalHandler}
              isShowVoteModalOpen={isShowVoteModalOpen}
            />
            <span>
              <div className="d-flex">
                <div>Proposal {proposal.id}</div>
                <div>
                  <ProposalStatus status={proposal?.status} className={classes.proposalStatus} />
                </div>
              </div>
            </span>
            <div className={classes.proposalTitleWrapper}>
              <div className={classes.proposalTitle}>
                <h1>{proposal.title} </h1>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex justify-content-end align-items-end">
            {isActiveForVoting && voteButton}
          </div>
        )}
      </div>

      <div className={classes.byLineWrapper}>
        {
          <>
            <h3>Proposed by</h3>
            <div className={classes.byLineContentWrapper}>
              {/* <HoverCard
                hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
                tip={proposal && proposal.proposer ? proposal.proposer : ''}
                id="byLineHoverCard"
              > */}
                <h3>
                  {proposer}
                  <span className={classes.propTransactionWrapper}>
                    {proposedAtTransactionHash}
                  </span>
                </h3>
              {/* </HoverCard> */}
            </div>
          </>
        }
      </div>


      {isMobile && (
        <div className={classes.mobileSubmitProposalButton}>{isActiveForVoting && voteButton}</div>
      )}

      {proposal && isActiveForVoting && hasVoted && (
        <Alert variant="success" className={classes.voterIneligibleAlert}>
          You voted <strong>{proposalVote}</strong> this proposal
        </Alert>
      )}

      {proposal && isActiveForVoting && proposalCreationTimestamp && !!availableVotes && !hasVoted && (
        <Alert variant="success" className={classes.voterIneligibleAlert}>
          Only Lil Nouns you owned or were delegated to you before{' '}
          {dayjs.unix(proposalCreationTimestamp).format('MMMM D, YYYY h:mm A z')} are eligible to
          vote.
        </Alert>
      )}
    </>
  );
};

export default ProposalHeader;
