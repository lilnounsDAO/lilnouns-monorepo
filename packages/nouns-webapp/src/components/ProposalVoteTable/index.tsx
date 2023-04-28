import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './ProposalVoteTable.module.css';
import ProposalVoteTableCell from '../ProposalVoteTableCell';

interface Vote {
  reason: string;
  delegate: string;
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
  delegatedVotes?: string;
}

interface ProposalVoteTableProps {
  votes?: Vote[];
}

export const splitVotesByReason = (votes: Vote[]) => {
  return {
    votesWithReason: votes.filter(v => v.reason && v.reason.length > 0),
    votesWithoutReason: votes.filter(v => v.reason && v.reason.length === 0),
  };
};

// Votes Table.
// Three column, For, Against, Abstain
// Make sure the columns adjust in size depending on whether each column has votes
// (i.e. if there are no votes for the "ABSTAIN" column, don't show it.)
// Each cell should show total votes, ens/ short wallet, reason and vote.
// Make sure votes with vote reasons float to the top.
// Truncate long vote reasons and make them expandable.

const ProposalVoteTable: React.FC<ProposalVoteTableProps> = props => {
  const { votes } = props;

  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    if (votes == undefined) return;
    const numColumn = votes
      ? [
          votes.filter(v => v.supportDetailed === 1).length,
          votes.filter(v => v.supportDetailed === 0).length,
          votes.filter(v => v.supportDetailed === 2).length,
        ].filter(n => n > 0).length
      : 0;

    setNumColumns(numColumn);
  });

  return (
    <>
      <div className={classes.container}>
        {votes && votes.length > 0 ? (
          <Row>
            <Col
              md={numColumns > 1 ? 4 : 12}
              className={`flex-grow-1 ${
                votes.filter(v => v.supportDetailed === 1).length > 0 ? '' : 'd-none'
              } `}
            >
              {votes
                .filter(v => v.supportDetailed === 1)
                .sort((a: Vote, b: Vote) => b.reason.length - a.reason.length)
                .map((v, i) => {
                  return (
                    <div className={classes.cell}>
                      <ProposalVoteTableCell key={i} vote={v} />
                    </div>
                  );
                })}
            </Col>
            <Col
              md={numColumns > 1 ? 4 : 12}
              className={`d-${numColumns > 1 ? '4' : '12'} flex-grow-1 ${
                votes.filter(v => v.supportDetailed === 0).length > 0 ? '' : 'd-none'
              } `}
            >
              {votes
                .filter(v => v.supportDetailed === 0)
                .sort((a: Vote, b: Vote) => b.reason.length - a.reason.length)
                .map((v, i) => {
                  return (
                    <div className={classes.cell}>
                      <ProposalVoteTableCell key={i} vote={v} />
                    </div>
                  );
                })}
            </Col>
            <Col
              md={numColumns > 1 ? 4 : 12}
              className={`d-${numColumns > 1 ? '4' : '12'} flex-grow-1 ${
                votes.filter(v => v.supportDetailed === 2).length > 0 ? '' : 'd-none'
              } `}
            >
              {votes
                .filter(v => v.supportDetailed === 2)
                .sort((a: Vote, b: Vote) => b.reason.length - a.reason.length)
                .map((v, i) => {
                  return (
                    <div className={classes.cell}>
                      <ProposalVoteTableCell key={i} vote={v} />
                    </div>
                  );
                })}
            </Col>
          </Row>
        ) : (
          <>
            <div className={classes.emptyState}>No votes yet for this proposal.</div>
          </>
        )}
      </div>
    </>
  );
};

export default ProposalVoteTable;
