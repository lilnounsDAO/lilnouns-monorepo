import classes from './CommentModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import Tooltip  from '../Tooltip';
import ShortAddress from '../ShortAddress';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const CommentModalOverlay: React.FC<{
  onDismiss: () => void;
  bidder: string;
  comment: string;
}> = props => {
  const { onDismiss, bidder, comment } = props;

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>
          <div className={classes.bidWrapper}>
            <div className={classes.header}>
              <div className={classes.title}>
                <h2>Bid comment</h2>
                <div>
                    <ShortAddress
                      size={40}
                      address={bidder}
                      avatar={true}
                      largeText={true}
                    />
                </div>
              </div>
            </div>
            <br/>
            <div>
              {`"${comment}"`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CommentModal: React.FC<{
  onDismiss: () => void;
  bidder: string;
  comment: string;
}> = props => {
  const { onDismiss, bidder, comment } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <CommentModalOverlay onDismiss={onDismiss} bidder={bidder} comment={comment} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default CommentModal;
