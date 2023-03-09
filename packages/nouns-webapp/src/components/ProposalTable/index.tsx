import classes from './ProposalTable.module.css';
import { PartialProposal } from '../../wrappers/nounsDao';
import { Alert, Row } from 'react-bootstrap';
import { LilNounProposalRow } from '../Proposals';

const ProposalTable = ({ proposals }: { proposals: PartialProposal[] }) => {
  return (
    <>
    <span className={classes.subHeaderRow}>Active proposals waiting for your vote</span>
      {proposals.length ? (
        <>
          
          <Row className={classes.proposals}>
            {proposals
              .slice(0)
              .reverse()
              .map(p => (
                <LilNounProposalRow proposal={p} key={p.id} />
              ))}
          </Row>
        </>
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>No proposals found</Alert.Heading>
          <p>Active proposals you haven't voted on will appear here.</p>
        </Alert>
      )}
       <br />
    </>
  );
};

export default ProposalTable;
