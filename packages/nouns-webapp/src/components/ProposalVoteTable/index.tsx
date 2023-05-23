import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './ProposalVoteTable.module.css';
import ProposalVoteTableCell from '../ProposalVoteTableCell';
import { SnapshotVoters } from '../../pages/NounsVote';
import { Vote as Support } from '../../wrappers/nounsDao';
import _ from 'lodash';
import { useMemo } from 'react';
import { MetagovVote } from '../../wrappers/bigNounsDao';

interface Vote {
  reason: string;
  delegate: string;
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
  delegatedVotes?: string;
}

interface ProposalVoteTableProps {
  votes?: Vote[];
  metagovVotes?: SnapshotVoters[];
  isNounsDAOProp?: boolean;
}

type UnifiedVote = {
  delegate: string;
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
  delegatedVotes?: string;
  voter?: string;
  vp?: number;
  choice?: number;
  nounIds?: string[];
  reason?: string;

  isMetagovVote?: boolean;
  isNounVote?: boolean;
};

// type UnifiedVote = Vote & SnapshotVoters & { isMetagovVote?: boolean, isNounVote?: boolean };

export function mapSupportDetailedToChoice(supportDetailed: number) {
  switch (supportDetailed) {
    case Support.AGAINST:
      return 2;
    case Support.FOR:
      return 1;
    case Support.ABSTAIN:
      return 3;
    default:
      // throw new Error(`Invalid supportDetailed value: ${supportDetailed}`);
      return 1;
  }
}

export function mapChoiceToSupportDetailed(choice: number) {
  switch (choice) {
    case MetagovVote.AGAINST:
      return 0;
    case MetagovVote.FOR:
      return 1;
    case MetagovVote.ABSTAIN:
      return 2;
    default:
      return 0;
    // throw new Error(`Invalid choice value: ${choice}`);
  }
}

export const unifyVotes = (votes?: Vote[], metagovVotes?: SnapshotVoters[]): UnifiedVote[] => {
  const unifiedVotes: UnifiedVote[] = [];

  // Add all votes to the unifiedVotes array
  votes?.forEach((vote: Vote) => {
    unifiedVotes.push({
      ...vote,
      choice: mapSupportDetailedToChoice(vote.supportDetailed),
      voter: vote.delegate,
      vp: vote.nounsRepresented.length,
      nounIds: vote.nounsRepresented,
      delegatedVotes: vote.delegatedVotes,
      isNounVote: true,
      isMetagovVote: false,
    });
  });

  // Add all metagovVotes to the unifiedVotes array, merging any that have the same delegate/voter
  metagovVotes?.forEach((metagovVote: SnapshotVoters) => {
    const omniVoter = unifiedVotes.find(
      vote => vote.delegate.toLowerCase() === metagovVote.voter.toLowerCase() && vote.supportDetailed === mapSupportDetailedToChoice(metagovVote.choice),
    );
    if (omniVoter) {
      omniVoter.reason = omniVoter.reason
        ? `${omniVoter.reason} \n ${metagovVote.reason}`
        : metagovVote.reason ?? '';
      omniVoter.isMetagovVote = true;
      omniVoter.isNounVote = true;

      omniVoter.choice = mapChoiceToSupportDetailed(metagovVote.choice);
      omniVoter.vp = metagovVote.vp;
      omniVoter.delegatedVotes = omniVoter.delegatedVotes;
      omniVoter.nounIds = metagovVote.nounIds;
    } else {
      unifiedVotes.push({
        ...metagovVote,
        delegate: metagovVote.voter ?? '',
        supportDetailed: mapChoiceToSupportDetailed(metagovVote.choice),
        nounsRepresented: metagovVote.nounIds,
        isNounVote: false,
        isMetagovVote: true,
      });
    }
  });

  return unifiedVotes;
};

const ProposalVoteTable: React.FC<ProposalVoteTableProps> = props => {
  const { votes, metagovVotes, isNounsDAOProp } = props;

  const unifiedVotes = useMemo(() => unifyVotes(votes, metagovVotes), [votes, metagovVotes]);

  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    setNumColumns(unifiedVotes && unifiedVotes.length > 0 ? 3 : 0);
  }, [unifiedVotes]);

  return (
    <div className={classes.container}>
      {numColumns > 0 ? (
        <Row>
          {[Support.FOR, Support.AGAINST, Support.ABSTAIN].map(choice => (
            <Col
              md={numColumns > 1 ? 4 : 12}
              className={`flex-grow-1 ${
                unifiedVotes &&
                unifiedVotes.filter(v => mapChoiceToSupportDetailed(v.choice ?? 0) === choice)
                  .length > 0
                  ? ''
                  : 'd-none'
              } `}
            >
              {unifiedVotes
                ?.filter(v => mapChoiceToSupportDetailed(v.choice ?? 0) === choice)
                .sort(
                  (a: UnifiedVote, b: UnifiedVote) =>
                    (b.reason?.length ?? 0) - (a.reason?.length ?? 0),
                )
                .map((v, i) => (
                  <div className={classes.cell}>
                    <ProposalVoteTableCell
                      key={`vote-${i}`}
                      vote={v.isNounVote ? (v as Vote) : undefined}
                      metagovVote={v.isMetagovVote ? (v as SnapshotVoters) : undefined}
                      isNounsDAOProp={isNounsDAOProp}
                      isNounVote={v.isNounVote}
                      isMetagovVote={v.isMetagovVote}
                    />
                  </div>
                ))}
            </Col>
          ))}
        </Row>
      ) : (
        <div className={classes.emptyState}>No votes yet for this proposal.</div>
      )}
    </div>
  );
};

export default ProposalVoteTable;
