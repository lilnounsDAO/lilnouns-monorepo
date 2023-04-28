import classes from './VoteSupportPill.module.css';
import { Vote } from '../../wrappers/nounsDao';
import React from 'react';
import clsx from 'clsx';

const statusVariant = (support: Vote | undefined) => {
  switch (support) {
    case Vote.FOR:
      return classes.for;
    case Vote.AGAINST:
      return classes.against;
    case Vote.ABSTAIN:
      return classes.abstain;
    default:
      return classes.abstain;
  }
};

const statusText = (support: Vote | undefined) => {
  switch (support) {
    case Vote.FOR:
      return 'For';
    case Vote.AGAINST:
      return 'Against';
    case Vote.ABSTAIN:
      return 'Abstain';
    default:
      return 'Undetermined';
  }
};

interface VoteSupportPillProps {
  support?: Vote;
  className?: string;
}

const VoteSupportPill: React.FC<VoteSupportPillProps> = props => {
  const { support, className } = props;
  return (
    <div className={clsx(statusVariant(support), classes.voteSupport, className)}>
      {statusText(support)}
    </div>
  );
};

export default VoteSupportPill;
