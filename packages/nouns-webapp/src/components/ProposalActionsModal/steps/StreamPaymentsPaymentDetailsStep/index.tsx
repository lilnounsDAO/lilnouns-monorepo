import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import BrandNumericEntry from '../../../BrandNumericEntry';
import BrandTextEntry from '../../../BrandTextEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import { SupportedCurrency } from '../TransferFundsDetailsStep';
import BigNumber from 'bignumber.js';
import { utils, BigNumber as EthersBigNumber } from 'ethers';
import ModalSubTitle from '../../../ModalSubtitle';
import BrandDropdown from '../../../BrandDropdown';
import useUSDCBalance from '../../../../hooks/useUSDCBalance';
import config from '../../../../config';
import useWETHBalance from '../../../../hooks/useWETHBalance';
const StreamPaymentsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, state, setState } = props;

  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [currency, setCurrency] = useState<SupportedCurrency.WETH | SupportedCurrency.USDC>(
    SupportedCurrency.USDC,
  );
  const [formattedAmount, setFormattedAmount] = useState<string>(state.amount ?? '');
  const [address, setAddress] = useState(state.address ?? '');

  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  // Get balances
  const wethBalance = useWETHBalance();
  const usdcBalance = useUSDCBalance();
  
  const formatBalance = (balance?: EthersBigNumber): string => {
    if (!balance) return '0';
    return utils.formatEther(balance);
  };

  const getCurrencyWithBalance = (currencyType: SupportedCurrency): string => {
    switch (currencyType) {
        case SupportedCurrency.WETH:
          return `${formatBalance(wethBalance)}`;
      case SupportedCurrency.USDC:
        return `${usdcBalance}`;
      default:
        return currencyType;
    }
  };

  useEffect(() => {
    if (utils.isAddress(address) && parseFloat(amount) > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  return (
    <>
      <ModalTitle>
        Add Streaming Payment Action
      </ModalTitle>

      <ModalSubTitle>
        At this time only USDC and WETH streams are supported
      </ModalSubTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency === SupportedCurrency.WETH ? 'WETH' : 'USDC'}
        onChange={e => {
          if (e.target.value === 'WETH') {
            setCurrency(SupportedCurrency.WETH);
          } else {
            setCurrency(SupportedCurrency.USDC);
          }
        }}
        chevronTop={38}
      >
        <option value="USDC">USDC</option>
        <option value="WETH">WETH</option>
      </BrandDropdown>

      <BrandNumericEntry
        label={'Amount'}
        sublabel={`Available ${getCurrencyWithBalance(currency)}`}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder={`0 ${currency === SupportedCurrency.USDC ? 'USDC' : 'WETH'}`}
        isInvalid={parseFloat(amount) > 0 && new BigNumber(amount).isNaN()}
      />

      <BrandTextEntry
        label={'Recipient'}
        onChange={e => setAddress(e.target.value)}
        value={address}
        type="string"
        placeholder="0x..."
        isInvalid={address.length === 0 ? false : !utils.isAddress(address)}
      />

      <ModalBottomButtonRow
        prevBtnText={'Back'}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={'Add Stream Date Details'}
        onNextBtnClick={() => {
          setState(x => ({ ...x, address, amount, TransferFundsCurrency: currency }));
          onNextBtnClick();
        }}
        isNextBtnDisabled={!isValidForNextStage}
      />
    </>
  );
};

export default StreamPaymentsDetailsStep;
