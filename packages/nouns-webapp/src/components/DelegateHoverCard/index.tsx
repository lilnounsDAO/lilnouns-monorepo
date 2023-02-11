import { useQuery } from '@apollo/client';
import { ScaleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { delegateNounsAtBlockQuery } from '../../wrappers/subgraph';
import HorizontalStackedNouns from '../HorizontalStackedNouns';
import ShortAddress from '../ShortAddress';
import classes from './DelegateHoverCard.module.css';

interface DelegateHoverCardProps {
  delegateId: string;
  proposalCreationBlock: number;
  isNounsDAOProp?: boolean;
}

const DelegateHoverCard: React.FC<DelegateHoverCardProps> = props => {
  const { delegateId, proposalCreationBlock, isNounsDAOProp } = props;

  const unwrappedDelegateId = delegateId ? delegateId.replace('delegate-', '') : '';

  const { data, loading, error } = useQuery(
    delegateNounsAtBlockQuery([unwrappedDelegateId], proposalCreationBlock),
    {
      context: { clientName: isNounsDAOProp ? 'NounsDAO' : 'LilNounsDAO' },
      //* no cache to mitigate against object mutation between lils and nouns
      fetchPolicy: 'no-cache',
    },
  );

  if (loading || !data || data === undefined || data.delegates.length === 0) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (error) {
    return <>Error fetching Vote info</>;
  }

  // nounsRepresented fetched from subgraph is limited to fetch the last 100 delegated tokens per account whereas delegatedVotes outputs entire total delegated token amt 
  const numVotesForProp = data.delegates[0].delegatedVotes; //data.delegates[0].nounsRepresented.length;

  const tokenType = isNounsDAOProp ? 'Noun' : 'Lil Noun'

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedNounWrapper}>
        <HorizontalStackedNouns
          nounIds={data.delegates[0].nounsRepresented.map((noun: { id: string }) => noun.id)}
          isNounsDAOProp={isNounsDAOProp}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.nounInfoWrapper}>
        <ScaleIcon height={20} width={20} className={classes.icon} />
        {/* //TODO: fix text wrapping */}
        {numVotesForProp == 1 ? (
          <>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>{tokenType}
          </>
        ) : (
          <>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>{tokenType}s
          </>
        )}
      </div>
    </div>
  );
};

export default DelegateHoverCard;
