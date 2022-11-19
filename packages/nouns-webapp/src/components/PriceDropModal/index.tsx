import classes from './PriceDropModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Auction } from '../../wrappers/nounsAuction';

import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { Bid } from '../../utils/types';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const PriceDropModalOverlay: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div className={classes.title}>
              <h2>Info</h2>
              <h1>Price Drop</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PriceDropModal: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <PriceDropModalOverlay onDismiss={onDismiss} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default PriceDropModal;
