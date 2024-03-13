import { useReverseENSLookUp } from '../../utils/ensLookup';
import { resolveNounContractAddress } from '../../utils/resolveNounsContractAddress';
import { useEthers } from '@usedapp/core';
import classes from './ShortAddress.module.css';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import React from 'react';
import Identicon from '../Identicon';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number; largeText?: boolean }> = props => {
  const { address, avatar, size = 24, largeText = false } = props;
  const { library: provider } = useEthers();

  const burnAddress = "0x0000000000000000000000000000000000000000"
  const addressString = address ? address : burnAddress;
  const ens = useReverseENSLookUp(addressString) || resolveNounContractAddress(address);
  const shortAddress = addressString === burnAddress ? "n/a" : useShortAddress(addressString);

  if (avatar) {
    return (
      <div className={largeText ? classes.shortAddressLargeText: classes.shortAddress}>
        {avatar && addressString != burnAddress && (
          <div key={addressString}>
            <Identicon size={size} address={addressString} provider={provider} />
          </div>
        )}
        <span>{ens ? ens : shortAddress}</span>
        {/* <span>{shortAddress}</span> */}
      </div>
    );
  }

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
