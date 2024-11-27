import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { utils, BigNumber as EthersBigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useEtherBalance } from '@usedapp/core';
import { ProposalActionModalStepProps } from '../..';
import BrandDropdown from '../../../BrandDropdown';
import BrandTextEntry from '../../../BrandTextEntry';
import BrandNumericEntry from '../../../BrandNumericEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import useLidoBalance from '../../../../hooks/useLidoBalance';
import config from '../../../../config';
import useUSDCBalance from '../../../../hooks/useUSDCBalance';

export enum SupportedCurrency {
  ETH = 'ETH',
  WETH = 'WETH',
  STETH = 'STETH',
  USDC = 'USDC',
}

const TransferFundsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  // Get balances
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const stethBalance = useLidoBalance();
  const usdcBalance = useUSDCBalance();

  const formatBalance = (balance?: EthersBigNumber): string => {
    if (!balance) return '0';
    return utils.formatEther(balance);
  };

  const getCurrencyWithBalance = (currencyType: SupportedCurrency): string => {
    switch (currencyType) {
      case SupportedCurrency.ETH:
        return `${formatBalance(ethBalance)}`;
      case SupportedCurrency.STETH:
        return `${formatBalance(stethBalance)}`;
      case SupportedCurrency.USDC:
        return `${usdcBalance}`;
      default:
        return currencyType;
    }
  };

  const [currency, setCurrency] = useState<SupportedCurrency>(
    state.TransferFundsCurrency ?? SupportedCurrency.ETH,
  );
  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [formattedAmount, setFormattedAmount] = useState<string>(state.amount ?? '');
  const [address, setAddress] = useState(state.address ?? '');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (utils.isAddress(address) && parseFloat(amount) > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  return (
    <div>
      <ModalTitle>
        Add Transfer Funds Action
      </ModalTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency}
        onChange={e => setCurrency(SupportedCurrency[e.target.value as SupportedCurrency])}
        chevronTop={38}
      >
        <option value="ETH">ETH</option>
        <option value="USDC">USDC</option>
        <option value="STETH">Lido Staked ETH</option>
      </BrandDropdown>

      <BrandNumericEntry
        label={`Amount`}
        sublabel={`Available ${getCurrencyWithBalance(currency)}`}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder={`0 ${currency}`}
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
        prevBtnText={"Back"}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={"Review and Add"}
        isNextBtnDisabled={!isValidForNextStage}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            amount,
            address,
            TransferFundsCurrency: currency,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default TransferFundsDetailsStep;
