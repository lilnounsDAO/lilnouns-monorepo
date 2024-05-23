import { XIcon } from '@heroicons/react/solid';
import { BigNumber } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom';
import { Bid } from '../../utils/types';
import { Auction } from '../../wrappers/nounsAuction';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import BidHistoryModalRow from '../BidHistoryModalRow';
import { StandaloneNounRoundedCorners } from '../StandaloneNoun';
import classes from './BidHistoryModal.module.css';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const BidHistoryModalOverlay: React.FC<{
  auction: Auction;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, auction } = props;

  const bids = useAuctionBids(auction.nounId);

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
            <div className={classes.nounWrapper}>
              <StandaloneNounRoundedCorners nounId={auction && auction.nounId} />
            </div>

            <div className={classes.title}>
              <h2>Bids for</h2>
              <h1>Lil Noun {auction && auction.nounId.toString()}</h1>
            </div>
          </div>
          <div className={classes.bidWrapper}>
            {bids && bids.length > 0 ? (
              <ul>
                {bids?.map((bid: Bid, i: number) => {
                  return <BidHistoryModalRow index={i} bid={bid} />;
                })}
              </ul>
            ) : (
              <div className={classes.nullStateText}>Bids will appear here</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const BidHistoryModal: React.FC<{
  auction: Auction;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, auction } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <BidHistoryModalOverlay onDismiss={onDismiss} auction={auction} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default BidHistoryModal;
