import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import { currentUnixEpoch, toUnixEpoch } from '../../../../utils/timeUtils';
import BrandDatePicker from '../../../BrandDatePicker';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalSubTitle from '../../../ModalSubtitle';
import ModalTitle from '../../../ModalTitle';

const StreamPaymentDateDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, setState } = props;

  const [startDate, setStartDate] = useState('');
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [endTimestamp, setEndTimestamp] = useState(0);

  useEffect(() => {
    setEndTimestamp(toUnixEpoch(endDate));
    setStartTimestamp(toUnixEpoch(startDate));
  }, [startDate, endDate]);

  return (
    <>
      <ModalTitle>
        Add Streaming Payment Action
      </ModalTitle>

      <ModalSubTitle>
        
          We suggest adding a buffer between when you assume the proposal to be executed and when
          the stream begins.
        
      </ModalSubTitle>

      <BrandDatePicker
        onChange={e => setStartDate(e.target.value)}
        label="Start date"
        isInvalid={startTimestamp > 0 && currentUnixEpoch() > startTimestamp}
      />

      <BrandDatePicker
        isInvalid={endTimestamp > 0 && endTimestamp < startTimestamp}
        onChange={e => setEndDate(e.target.value)}
        label="End date"
      />

      <ModalSubTitle>
        Streams start and end at 00:00 UTC on selected dates.
      </ModalSubTitle>

      <ModalBottomButtonRow
        prevBtnText={'Back'}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={'Review Action Details'}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            streamStartTimestamp: startTimestamp,
            streamEndTimestamp: endTimestamp,
          }));
          onNextBtnClick();
        }}
        isNextBtnDisabled={startTimestamp > 0 && endTimestamp > 0 && endTimestamp < startTimestamp}
      />
    </>
  );
};

export default StreamPaymentDateDetailsStep;
