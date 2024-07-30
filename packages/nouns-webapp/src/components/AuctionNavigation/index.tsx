import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setNextOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
} from '../../state/slices/onDisplayAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import classes from './AuctionNavigation.module.css';

const AuctionNavigation = (props: { nounId: number }) => {
  const { nounId } = props;

  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const dispatch = useAppDispatch();

  const history = useHistory();
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = onDisplayAuction?.nounId.toNumber();

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionNounId());
    history.push(`/lilnoun/${nounId - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionNounId());
    history.push(`/lilnoun/${nounId + 1}`);
  };

  const isFirstAuction = nounId === 0;
  const isLastAuction = nounId === lastNounId;

  // Page through Nouns via keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'ArrowLeft') {
        // This is a hack. If we don't put this the first keystoke
        // from the noun at / doesn't work (i.e. to go from current noun to current noun - 1 would take two arrow presses)
        if (onDisplayAuctionNounId === lastAuctionNounId) {
          history.push(`/noun/${lastAuctionNounId}`);
        }

        if (!isFirstAuction) {
          prevAuctionHandler();
        }
      }
      if (event.key === 'ArrowRight') {
        if (!isLastAuction) {
          nextAuctionHandler();
        }
      }
    },
    [history, isFirstAuction, isLastAuction, lastAuctionNounId, onDisplayAuctionNounId],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={classes.navArrowsContainer}>
      <button
        onClick={() => prevAuctionHandler()}
        className={isCool ? classes.leftArrowCool : classes.leftArrowWarm}
        disabled={isFirstAuction}
      >
        ←
      </button>
      <button
        onClick={() => nextAuctionHandler()}
        className={isCool ? classes.rightArrowCool : classes.rightArrowWarm}
        disabled={isLastAuction}
      >
        →
      </button>
    </div>
  );
};
export default AuctionNavigation;
