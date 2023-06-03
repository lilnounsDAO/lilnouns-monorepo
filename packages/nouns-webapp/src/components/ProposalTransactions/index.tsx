import { Popover, OverlayTrigger, Row, Col, Button } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { ProposalTransaction } from '../../wrappers/nounsDao';
import classes from './ProposalTransactions.module.css';
import xIcon from '../../assets/x-icon.png';
import { utils } from 'ethers';
import { simulateTransaction } from '../../utils/tenderly';
import config from '../../config';

const ProposalTransactions = ({
  className,
  proposalTransactions,
  onRemoveProposalTransaction,
  onSimulateProposalTransaction,
}: {
  className?: string;
  proposalTransactions: ProposalTransaction[];
  onRemoveProposalTransaction: (index: number) => void;
  onSimulateProposalTransaction: (index: number, status: boolean) => void;
}) => {
  const getPopover = (tx: ProposalTransaction) => (
    <Popover className={classes.popover} id="transaction-details-popover">
      <Popover.Header as="h3">Transaction Details</Popover.Header>
      <Popover.Body>
        <Row>
          <Col sm="3">
            <b>Address</b>
          </Col>
          <Col sm="9">
            <a href={buildEtherscanAddressLink(tx.address)} target="_blank" rel="noreferrer">
              {tx.address}
            </a>
          </Col>
        </Row>
        <Row>
          <Col sm="3">
            <b>Value</b>
          </Col>
          <Col sm="9">{tx.value ? `${utils.formatEther(tx.value)} ETH` : 'None'}</Col>
        </Row>
        <Row>
          <Col sm="3">
            <b>Function</b>
          </Col>
          <Col sm="9">{tx.signature || 'None'}</Col>
        </Row>
        <Row>
          <Col sm="3">
            <b>Calldata</b>
          </Col>
          <Col sm="9">
            {tx.calldata === '0x' ? 'None' : tx.decodedCalldata ? tx.decodedCalldata : tx.calldata}
          </Col>
        </Row>
      </Popover.Body>
    </Popover>
  );

  const simulateRPC = (propTxns: ProposalTransaction[]) => {
    propTxns.forEach(async (item, i) => {

      const resp = await simulateTransaction(
        config.addresses.nounsDaoExecutor,
        item.address,
        item.decodedCalldata,
        item.value ? parseInt(item.value) : 0,
        item.abi,
        item.signature,
      )
        .then(res => {
          const status: boolean = res.data.simulation.status;
          onSimulateProposalTransaction(i, status);
          return status;
        })
        .catch(err => {
          onSimulateProposalTransaction(i, false);
          return false;
        });

      return resp;
    });
  };

  return (
    <div className={className}>
      {proposalTransactions.map((tx, i) => (
        <OverlayTrigger
          key={i}
          trigger={['hover', 'focus']}
          placement="top"
          overlay={getPopover(tx)}
        >
          <div
            className={`${classes.transactionDetails} d-flex justify-content-between align-items-center`}
          >
            <div>
              <span>
                {tx.simulationStatus == undefined ? (
                  <></>
                ) : (
                  <>
                    <span
                      style={{
                        height: '10px',
                        width: '10px',
                        borderRadius: '50%',
                        display: 'inline-block',
                        backgroundColor: tx.simulationStatus ? 'green' : 'red',
                        marginLeft: '0px',
                        marginRight: '5px',
                      }}
                    />
                  </>
                )}
                Transaction #{i + 1} -{' '}
              </span>
              <span>
                <b>{tx.signature || 'transfer()'}</b>
              </span>
            </div>
            <button
              className={classes.removeTransactionButton}
              onClick={() => onRemoveProposalTransaction(i)}
            >
              <img src={xIcon} alt="Remove Transaction" />
            </button>
          </div>
        </OverlayTrigger>
      ))}
      {proposalTransactions.length ? (
        <Button
          onClick={() => simulateRPC(proposalTransactions)}
          className={classes.simulateTransactionButton}
          variant="outline-success"
        >
          simulate
        </Button>
      ) : null}
    </div>
  );
};
export default ProposalTransactions;
