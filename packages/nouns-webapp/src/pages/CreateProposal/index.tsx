import { Col, Alert, Button } from 'react-bootstrap';
import Section from '../../layout/Section';
import {
  ProposalState,
  ProposalTransaction,
  useProposal,
  useProposalCount,
  useProposalThreshold,
  usePropose,
} from '../../wrappers/nounsDao';
import { useUserVotes } from '../../wrappers/nounToken';
import classes from './CreateProposal.module.css';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import ProposalEditor from '../../components/ProposalEditor';
import CreateProposalButton from '../../components/CreateProposalButton';
import ProposalTransactions from '../../components/ProposalTransactions';
import ProposalTransactionFormModal from '../../components/ProposalTransactionFormModal';
import { withStepProgress } from 'react-stepz';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import ProposalActionModal from '../../components/ProposalActionsModal';
import { useEthNeeded } from '../../utils/tokenBuyerContractUtils/tokenBuyer';
import config from '../../config';

const CreateProposalPage = () => {
  const { account } = useEthers();
  const latestProposalId = useProposalCount();
  const { proposal: latestProposal } = useProposal(latestProposalId ?? 0);
  const availableVotes = useUserVotes();
  const proposalThreshold = useProposalThreshold();

  const { propose, proposeState } = usePropose();

  const [proposalTransactions, setProposalTransactions] = useState<ProposalTransaction[]>([]);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');

  const [totalUSDCPayment, setTotalUSDCPayment] = useState<number>(0);
  const [tokenBuyerTopUpEth, setTokenBuyerTopUpETH] = useState<string>('0');
  const [previousProposalId, setPreviousProposalId] = useState<number | undefined>(undefined);

  const ethNeeded = useEthNeeded(
    config.addresses.tokenBuyer ?? '',
    totalUSDCPayment,
    config.addresses.tokenBuyer === undefined || totalUSDCPayment === 0,
  );

  const handleAddProposalAction = useCallback(
    (transactions: ProposalTransaction | ProposalTransaction[]) => {
      const transactionsArray = Array.isArray(transactions) ? transactions : [transactions];
      transactionsArray.forEach(transaction => {
        if (!transaction.address.startsWith('0x')) {
          transaction.address = `0x${transaction.address}`;
        }
        if (!transaction.calldata.startsWith('0x')) {
          transaction.calldata = `0x${transaction.calldata}`;
        }

        if (transaction.usdcValue) {
          setTotalUSDCPayment(totalUSDCPayment + transaction.usdcValue);
        }
      });
      setProposalTransactions([...proposalTransactions, ...transactionsArray]);

      setShowTransactionFormModal(false);
    },
    [proposalTransactions, totalUSDCPayment],
  );

  const handleRemoveProposalAction = useCallback(
    (index: number) => {
      setTotalUSDCPayment(totalUSDCPayment - (proposalTransactions[index].usdcValue ?? 0));
      setProposalTransactions(proposalTransactions.filter((_, i) => i !== index));
    },
    [proposalTransactions, totalUSDCPayment],
  );

  useEffect(() => {
    // only set this once
    if (latestProposalId !== undefined && !previousProposalId) {
      setPreviousProposalId(latestProposalId);
    }
  }, [latestProposalId, previousProposalId]);

  useEffect(() => {
    if (ethNeeded !== undefined && ethNeeded !== tokenBuyerTopUpEth && totalUSDCPayment > 0) {
      const hasTokenBuyterTopTop =
        proposalTransactions.filter(txn => txn.address === config.addresses.tokenBuyer).length > 0;

      // Add a new top up txn if one isn't there already, else add to the existing one
      if (parseInt(ethNeeded) > 0 && !hasTokenBuyterTopTop) {
        handleAddProposalAction({
          address: config.addresses.tokenBuyer ?? '',
          value: ethNeeded ?? '0',
          calldata: '0x',
          signature: '',
        });
      } else {
        if (parseInt(ethNeeded) > 0) {
          const indexOfTokenBuyerTopUp =
            proposalTransactions
              .map((txn, index: number) => {
                if (txn.address === config.addresses.tokenBuyer) {
                  return index;
                } else {
                  return -1;
                }
              })
              .filter(n => n >= 0) ?? new Array<number>();

          const txns = proposalTransactions;
          if (indexOfTokenBuyerTopUp.length > 0) {
            txns[indexOfTokenBuyerTopUp[0]].value = ethNeeded;
            setProposalTransactions(txns);
          }
        }
      }

      setTokenBuyerTopUpETH(ethNeeded ?? '0');
    }
  }, [
    ethNeeded,
    handleAddProposalAction,
    handleRemoveProposalAction,
    proposalTransactions,
    tokenBuyerTopUpEth,
    totalUSDCPayment,
  ]);

  //---

  const handleSimulateTxn = useCallback((index: number, status: boolean) => {
    setProposalTransactions(prevProposalTransactions =>
      prevProposalTransactions.map((tx, i) => {
        if (i === index) {
          return { ...tx, simulationStatus: status };
        }
        return tx;
      }),
    );
  }, []);
  
  const handleTitleInput = useCallback(
    (title: string) => {
      setTitleValue(title);
    },
    [setTitleValue],
  );

  const handleBodyInput = useCallback(
    (body: string) => {
      setBodyValue(body);
    },
    [setBodyValue],
  );

  const isFormInvalid = useMemo(
    () => !proposalTransactions.length || titleValue === '' || bodyValue === '',
    [proposalTransactions, titleValue, bodyValue],
  );

  const hasEnoughVote = Boolean(
    availableVotes && proposalThreshold !== undefined && availableVotes > proposalThreshold,
  );

  const handleCreateProposal = async () => {
    if (!proposalTransactions?.length) return;

    await propose(
      proposalTransactions.map(({ address }) => address), // Targets
      proposalTransactions.map(({ value }) => value ?? '0'), // Values
      proposalTransactions.map(({ signature }) => signature), // Signatures
      proposalTransactions.map(({ calldata }) => calldata), // Calldatas
      `# ${titleValue}\n\n${bodyValue}`, // Description
    );
  };

  const [showTransactionFormModal, setShowTransactionFormModal] = useState(false);
  const [isProposePending, setProposePending] = useState(false);

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const pageTitle = "Create Proposal - Lil Nouns DAO";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    switch (proposeState.status) {
      case 'None':
        setProposePending(false);
        break;
      case 'Mining':
        setProposePending(true);
        break;
      case 'Success':
        setModal({
          title: 'Success',
          message: 'Proposal Created!',
          show: true,
        });
        setProposePending(false);
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: proposeState?.errorMessage || 'Please try again.',
          show: true,
        });
        setProposePending(false);
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: proposeState?.errorMessage || 'Please try again.',
          show: true,
        });
        setProposePending(false);
        break;
    }
  }, [proposeState, setModal]);

  return (
    <Section fullWidth={false} className={classes.createProposalPage}>
      <ProposalActionModal
        onDismiss={() => setShowTransactionFormModal(false)}
        show={showTransactionFormModal}
        onActionAdd={handleAddProposalAction}
      />
      <Col lg={{ span: 8, offset: 2 }}>
        <Link to="/vote">← All Proposals</Link>
      </Col>
      <Col lg={{ span: 8, offset: 2 }} className={classes.createProposalForm}>
        <h3 className={classes.heading}>Create Proposal</h3>
        <Alert variant="secondary" className={classes.voterIneligibleAlert}>
          <b>Tip</b>: Add one or more transactions and describe your proposal for the community. The
          proposal cannot be modified after submission, so please verify all information before
          submitting. The voting period will begin after 2 1/3 days and last for 3 days.
          <br />
          <br />
          <b>Simulate transactions</b>: Simulate to see if all transactions can be executed before submiting your proposal.
          <br />
          <br />
          You <b>MUST</b> maintain enough voting power to meet the proposal threshold until your
          proposal is executed. If you fail to do so, anyone can cancel your proposal.
        </Alert>
        <div className="d-grid">
          <Button
            className={classes.proposalActionButton}
            variant="dark"
            onClick={() => setShowTransactionFormModal(true)}
          >
            Add Action
          </Button>
        </div>
        <ProposalTransactions
          proposalTransactions={proposalTransactions}
          onRemoveProposalTransaction={handleRemoveProposalAction} 
          onSimulateProposalTransaction={handleSimulateTxn}     
          />

        {totalUSDCPayment > 0 && tokenBuyerTopUpEth !== '0' && (
          <Alert variant="secondary" className={classes.tokenBuyerNotif}>
            <b>
              Note
            </b>
            :{' '}
              Because this proposal contains a USDC fund transfer action we've added an additional
              ETH transaction to refill the TokenBuyer contract. This action allows to DAO to
              continue to trustlessly acquire USDC to fund proposals like this.
          </Alert>
        )}
        <ProposalEditor
          title={titleValue}
          body={bodyValue}
          onTitleInput={handleTitleInput}
          onBodyInput={handleBodyInput}
        />
        <CreateProposalButton
          className={classes.createProposalButton}
          isLoading={isProposePending}
          proposalThreshold={proposalThreshold}
          hasActiveOrPendingProposal={
            (latestProposal?.status === ProposalState.ACTIVE ||
              latestProposal?.status === ProposalState.PENDING) &&
            latestProposal.proposer === account
          }
          hasEnoughVote={hasEnoughVote}
          isFormInvalid={isFormInvalid}
          handleCreateProposal={handleCreateProposal}
        />
      </Col>
    </Section>
  );
};

export default withStepProgress(CreateProposalPage);
