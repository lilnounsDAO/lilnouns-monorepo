import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import classes from './ProposalVoteTableCell.module.css';
import VoteSupportPill from '../VoteSupportPill';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import { TightStackedCircleNounsCells } from '../TightStackedCircleNouns';

interface Vote {
  reason: string;
  delegate: string;
  supportDetailed: 0 | 1 | 2;
  nounsRepresented: string[];
  delegatedVotes?: string;
}

interface ProposalVoteTableCellProps {
  vote: Vote;
}

const ProposalVoteTableCell: React.FC<ProposalVoteTableCellProps> = props => {
  const { vote } = props;

  const ens = vote ? useReverseENSLookUp(vote.delegate) : '';
  const shortAddress = vote ? useShortAddress(vote.delegate) : '';

  const [isExpanded, setIsExpanded] = useState(true);
  const [showTruncation, setShowTruncation] = useState(false);
  const reasonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vote == undefined) return;
    setShowTruncation(vote && vote.reason.length > 100);
  }, [vote.reason]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const expandedTextClass = isExpanded ? 'expanded' : '';

  return (
    <div className={classes.columns} style={{ paddingBottom: isExpanded ? '0.5rem' : '0' }}>
      <Col className={classes.wrapper} style={{ paddingBottom: isExpanded ? '0.5rem' : '0' }}>
        <div className={classes.full}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center">
              <TightStackedCircleNounsCells
                nounIds={
                  vote.nounsRepresented.length
                    ? vote.nounsRepresented.map((nounId: string) => parseInt(nounId))
                    : []
                }
                isNounsDAOProp={false}
              />

              <div className={classes.voterDetails}>
                <div className={classes.heading}>
                  {ens || shortAddress}
                  <br />
                </div>
                <div className={classes.subheading}>{vote.delegatedVotes} Lil Nouns</div>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-start">
              <div className="btn-toolbar" role="btn-toolbar" aria-label="Basic example">
                <VoteSupportPill support={vote.supportDetailed} className="voteSupport" />
              </div>
            </div>
          </div>

          {vote.reason.length > 0 ? (
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
                {vote.reason.length > 0 ? vote.reason : 'no vote reason'}
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
