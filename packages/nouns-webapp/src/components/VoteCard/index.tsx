import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { isMobileScreen } from '../../utils/isMobile';
import { Proposal } from '../../wrappers/nounsDao';
import NounImageVoteTable from '../NounImageVoteTable';
import VoteProgresBar from '../VoteProgressBar';
import classes from './VoteCard.module.css';

export enum VoteCardVariant {
  FOR,
  AGAINST,
  ABSTAIN,
}

interface VoteCardProps {
  proposal: Proposal;
  percentage: number;
  nounIds: Array<string>;
  variant: VoteCardVariant;
  isNounsDAOProp?: boolean;
  lilnounIds: Array<string>;
  delegateView?: boolean;
  snapshotView?: boolean;
  snapshotVoteCount?: number;
  delegateGroupedVoteData?:
    | { delegate: string; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;

}

const VoteCard: React.FC<VoteCardProps> = props => {
  const {
    proposal,
    percentage,
    nounIds,
    variant,
    isNounsDAOProp,
    delegateView,
    delegateGroupedVoteData,
    lilnounIds,
    snapshotView,
    snapshotVoteCount
  } = props;
  const isMobile = isMobileScreen();

  //DONE: for Nouns votes, use Big Nouns in NounImageVoteTable

  let titleClass;
  let titleCopy;
  let voteCount;
  let supportDetailedValue: 0 | 1 | 2;
  switch (variant) {
    case VoteCardVariant.FOR:
      titleClass = classes.for;
      titleCopy = 'For';
      voteCount = snapshotView ? snapshotVoteCount : proposal.forCount;
      supportDetailedValue = 1;
      break;
    case VoteCardVariant.AGAINST:
      titleClass = classes.against;
      titleCopy = 'Against';
      voteCount = snapshotView ? snapshotVoteCount : proposal.againstCount;
      supportDetailedValue = 0;
      break;
    default:
      titleClass = classes.abstain;
      titleCopy = 'Abstain';
      voteCount = snapshotView ? snapshotVoteCount : proposal.abstainCount;
      supportDetailedValue = 2;
      break;
  }

  const filteredDelegateGroupedVoteData =
    delegateGroupedVoteData?.filter(v => v.supportDetailed === supportDetailedValue) ?? [];

  return (
    <Col lg={4} className={classes.wrapper}>
      <Card className={classes.voteCountCard}>
        <Card.Body className="p-2">
          <Card.Text className="py-2 m-0">
            <span className={`${classes.voteCardHeaderText} ${titleClass}`}>{titleCopy}</span>
            {!isMobile && (
              <span className={classes.voteCardVoteCount}>

                {delegateView ? (
                  <>
                    {filteredDelegateGroupedVoteData.length === 1 ? (
                      <>
                        {filteredDelegateGroupedVoteData.length} <span>Address</span>
                      </>
                    ) : (
                      <>
                        {filteredDelegateGroupedVoteData.length} <span>Addresses</span>
                      </>
                    )}
                  </>
                ) : snapshotView ? (
                  <>
                    {voteCount} 
                    {/* <span>Lil Nouns</span> */}
                  </>
                ) : (
                  voteCount
                )}
              </span>
            )}
          </Card.Text>
          {isMobile && (
            <Card.Text className="py-2 m-0">
              <span className={classes.voteCardVoteCount}>{voteCount}</span>
            </Card.Text>
          )}

          <VoteProgresBar variant={variant} percentage={snapshotView ? 0 : percentage} />
          {!isMobile && (
            <Row className={classes.nounProfilePics}>
              {delegateView ? (
                
                <NounImageVoteTable
                  nounIds={nounIds}
                  propId={parseInt(proposal.id || '0')}
                  isNounsDAOProp={isNounsDAOProp}
                />
              ) : snapshotView ? (
                <NounImageVoteTable
                  nounIds={lilnounIds}
                  propId={parseInt(proposal.id || '0')}
                  isNounsDAOProp={false}
                />
              ) : (
                <NounImageVoteTable
                  nounIds={nounIds}
                  propId={parseInt(proposal.id || '0')}
                  isNounsDAOProp={isNounsDAOProp}
                />
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VoteCard;
