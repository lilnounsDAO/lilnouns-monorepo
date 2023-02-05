import React, { useState } from 'react';
import {
  ProposalActionCreationStep,
  ProposalActionModalStepProps,
  ProposalActionType,
} from '../..';
import BrandDropdown from '../../../BrandDropdown';
import ModalSubTitle from '../../../ModalSubtitle';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import Link from '../../../Link';
import classes from './SelectProposalActionStep.module.css';

const SelectProposalActionStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, state, setState } = props;
  const [nextStep, setNextStep] = useState<ProposalActionCreationStep>(
    state.actionType === ProposalActionType.FUNCTION_CALL
      ? ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION
      : ProposalActionCreationStep.LUMP_SUM_DETAILS,
  );

  const nounsConnectLink = (
    <Link text="Nouns Connect" url="https://www.nounsconnect.wtf/" leavesPage={true} />
  );

  return (
    <div>
      <ModalTitle>Add Proposal Action</ModalTitle>
      <ModalSubTitle>
        <b>Supported Action Types:</b>
        <hr />
        <b>• Transfer Funds: </b>Send a fixed amount of ETH
        <br />
        <b>• Function Call: </b>Call a contract function.
      </ModalSubTitle>
      <BrandDropdown
        value={
          state.actionType === ProposalActionType.LUMP_SUM ? 'Transfer Funds' : 'Function Call'
        }
        onChange={e => {
          setState(x => ({
            ...x,
            actionType:
              e.target.value === 'Transfer Funds'
                ? ProposalActionType.LUMP_SUM
                : ProposalActionType.FUNCTION_CALL,
          }));

          if (e.target.value === 'Transfer Funds') {
            setNextStep(ProposalActionCreationStep.LUMP_SUM_DETAILS);
          } else {
            setNextStep(ProposalActionCreationStep.FUNCTION_CALL_SELECT_FUNCTION);
          }
        }}
      >
        <option value={'Transfer Funds'}>Transfer Funds</option>
        <option value={'Function Call'}>Function Call</option>
      </BrandDropdown>
      <ModalBottomButtonRow
        prevBtnText={'Close'}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={'Add Action Details'}
        onNextBtnClick={() => {
          onNextBtnClick(nextStep);
        }}
      />
      <div className={classes.nounsConnectWrapper}>
        <span className={classes.nounsConnectCopy}>
          Alternativley, build proposal actions through {nounsConnectLink}.
        </span>
      </div>
    </div>
  );
};

export default SelectProposalActionStep;
