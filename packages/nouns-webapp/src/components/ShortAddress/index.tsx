import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEthers } from '@usedapp/core';
// import Davatar from '@davatar/react';
import Identicon from '../Identicon';
import classes from './ShortAddress.module.css';

export const useShortAddress = (address: string): string => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const { library: provider } = useEthers();

  if (!address){
    props.address = "0x0000000000000000000000000000000000000000"
  }

  const ens = useReverseENSLookUp(address);
     //DONE: Add reverse lookup after stable rpc plan (temp fix)
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Identicon size={size} address={address} provider={provider} />
          </div>
        )}
        <span>{ens ? ens : shortAddress}</span>
        {/* <span>{shortAddress}</span> */}
      </div>
    );
  }

  // return <>{ens ? ens : shortAddress}</>;
  return <>{shortAddress}</>;
};

export default ShortAddress;
