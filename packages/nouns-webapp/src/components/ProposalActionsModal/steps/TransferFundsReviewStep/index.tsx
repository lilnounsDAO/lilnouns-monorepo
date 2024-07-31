import { Trans } from '@lingui/macro';
import { utils } from 'ethers';
import React from 'react';
import { FinalProposalActionStepProps, ProposalActionModalState } from '../..';
import ShortAddress from '../../../ShortAddress';
import { SupportedCurrency } from '../TransferFundsDetailsStep';
import classes from './TransferFundsReviewStep.module.css';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import config from '../../../../config';

const handleActionAdd = (state: ProposalActionModalState, onActionAdd: (e?: any) => void) => {
  if (state.TransferFundsCurrency === SupportedCurrency.ETH) {
    onActionAdd({
      address: state.address,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      signature: '',
      calldata: '0x',
    });
  }  else if (state.TransferFundsCurrency === SupportedCurrency.STETH) {
    const values = [state.address, utils.parseEther((state.amount ?? 0).toString()).toString()];
    onActionAdd({
      address: config.addresses.steth,
      value: '0',
      signature: 'transfer(address,uint256)',
      decodedCalldata: JSON.stringify(values),
      calldata: utils.defaultAbiCoder.encode(['address', 'uint256'], values),
    });
  } else {
    // This should never happen
    alert('Unsupported currency selected');
  }
};

const TransferFundsReviewStep: React.FC<FinalProposalActionStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, onDismiss } = props;

  return (
    <div>
      <ModalTitle>
       Review Transfer Funds Action
      </ModalTitle>

      <span className={classes.label}>Pay</span>
      <div className={classes.text}>
        {Intl.NumberFormat(undefined, { maximumFractionDigits: 18 }).format(Number(state.amount))}{' '}
        {state.TransferFundsCurrency}
      </div>
      <span className={classes.label}>To</span>
      <div className={classes.text}>
        <ShortAddress address={state.address} />
      </div>

      <ModalBottomButtonRow
        prevBtnText={"Back"}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={"Add Transfer Funds Action"}
        onNextBtnClick={() => {
          handleActionAdd(state, onNextBtnClick);
          onDismiss();
        }}
      />
    </div>
  );
};

export default TransferFundsReviewStep;
