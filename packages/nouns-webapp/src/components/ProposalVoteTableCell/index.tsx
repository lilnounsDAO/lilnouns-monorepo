import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import classes from './ProposalVoteTableCell.module.css';
import VoteSupportPill from '../VoteSupportPill';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import { TightStackedCircleNounsCells } from '../TightStackedCircleNouns';
import { SnapshotVoters } from '../../pages/NounsVote';
import { Vote as Support } from '../../wrappers/nounsDao';

interface Vote {
  reason: string;
  delegate: string;
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
  delegatedVotes?: string;
}

interface ProposalVoteTableCellProps {
  vote?: Vote;
  metagovVote?: SnapshotVoters;
  isNounsDAOProp?: boolean;
  isNounVote?: boolean;
  isMetagovVote?: boolean;
}

const ProposalVoteTableCell: React.FC<ProposalVoteTableCellProps> = props => {
  const { vote, metagovVote, isNounsDAOProp, isNounVote, isMetagovVote} = props;
  
  // Use delegate from vote or voter from metagovVote
  const delegate = vote ? vote.delegate : metagovVote ? metagovVote.voter : '';

// v.isMetagovVote ? undefined : v as Vote}
// v.isMetagovVote ? v as SnapshotVoters : undefined}

  const isNounsCell = isNounsDAOProp ? (vote ? true : metagovVote ? false : false) : false
  
  const ens = delegate ? useReverseENSLookUp(delegate) : '';
  const shortAddress = delegate ? useShortAddress(delegate) : '';

  const voteSuport = (choice: number) => {
    switch (choice) {
      case 1: return Support.FOR
      case 2: return Support.AGAINST
      case 3: return Support.ABSTAIN
  
      default:
        break;
    }
  }

  const supportDetailed = vote ? vote.supportDetailed : voteSuport(metagovVote?.choice ?? 0);


  const reason = vote ? vote.reason : metagovVote?.reason ?? ""

  const nounIds = vote
    ? vote.nounsRepresented.map((nounId: string) => parseInt(nounId))
    : metagovVote
    ? metagovVote.nounIds.map((nounId: string) => parseInt(nounId))
    : [];

  const delegatedVotes = vote?.delegatedVotes || metagovVote?.vp || 0;

  // TODO: noun/s and lil noun/s
  // TODO: Lil noun count below noun count

  const delegatedVoteText = vote
    ? `${delegatedVotes} Nouns`
    : metagovVote
    ? `${delegatedVotes} Lil Nouns`
    : '';


    //  isNounVote && isMetagovVote ? `${vote?.delegatedVotes ?? 0} Nouns & ${metagovVote?.vp ?? 0} Lil Nouns`

  const [isExpanded, setIsExpanded] = useState(true);
  const [showTruncation, setShowTruncation] = useState(false);
  const reasonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowTruncation(reason ? reason.length > 100: false);
  }, [reason]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const expandedTextClass = isExpanded ? 'expanded' : '';
  const voteToken = isNounsDAOProp ? "Noun" : "Lil Noun"

  return (
    <div className={classes.columns} style={{ paddingBottom: isExpanded ? '0.5rem' : '0' }}>
      <Col className={classes.wrapper} style={{ paddingBottom: isExpanded ? '0.5rem' : '0' }}>
        <div className={classes.full}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center">
              <TightStackedCircleNounsCells nounIds={nounIds} isNounsDAOProp={isNounsCell} />

              <div className={classes.voterDetails}>
                <div className={classes.heading}>
                  {ens || shortAddress}
                  <br />
                </div>

                {isNounVote ? (
                  <>
                    {vote?.delegatedVotes === '1' ? (
                      <div className={classes.subheading}>{`${vote?.delegatedVotes} ${voteToken}`}</div>
                    ) : (
                      <div className={classes.subheading}>{`${vote?.delegatedVotes} ${voteToken}s`}</div>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {isMetagovVote ? (
                  <>
                    {metagovVote?.vp === 1 ? (
                      <div className={classes.subheading}>{`${metagovVote?.vp} Lil Noun`}</div>
                    ) : (
                      <div className={classes.subheading}>{`${metagovVote?.vp} Lil Nouns`}</div>
                    )}
                  </>
                ) : (
                  <></>
                )}

              </div>
            </div>
            <div className="d-flex justify-content-end align-items-start">
              <div className="btn-toolbar" role="btn-toolbar" aria-label="Basic example">
                <VoteSupportPill support={supportDetailed} className="voteSupport" />
              </div>
            </div>
          </div>

          {reason.length > 0 ? (
            <div className={classes.reasonRow}>
              <div
                className={`${classes.reasonText} ${expandedTextClass}`}
                ref={reasonRef}
                onClick={handleToggleExpand}
                style={{
                  maxHeight: isExpanded
                    ? reasonRef.current?.scrollHeight
                    : showTruncation
                    ? '4rem'
                    : 'none',
                  overflow: 'hidden',
                  cursor: showTruncation ? 'pointer' : 'auto',
                  textOverflow: showTruncation ? 'ellipsis' : 'clip',
                }}
              >
                {reason.length > 0 ? reason : 'no vote reason'}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Col>
    </div>
  );  
};

export default ProposalVoteTableCell;
