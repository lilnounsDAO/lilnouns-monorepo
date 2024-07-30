import { push } from 'connected-react-router';
import { useEffect } from 'react';
import Auction from '../../components/Auction';
import { AuctionPreviousNouns } from '../../components/AuctionPreviousNouns/AuctionPreviousNouns';
import Banner from '../../components/Banner';
import Documentation from '../../components/Documentation';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setOnDisplayAuctionNounId,
  setOnDisplayAuctionStartTime,
} from '../../state/slices/onDisplayAuction';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const lastAuctionStartTime = useAppSelector(state => state.onDisplayAuction.lastAuctionStartTime);
  const onDisplayAuctionNounId = onDisplayAuction?.nounId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounId) return;
    if (!lastAuctionStartTime) return;

    if (initialAuctionId !== undefined && lastAuctionStartTime !== undefined) {
      // handle out  of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        dispatch(setOnDisplayAuctionStartTime(lastAuctionStartTime!));
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId && lastAuctionStartTime) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        dispatch(setOnDisplayAuctionStartTime(lastAuctionStartTime!));
      }
    }
  }, [lastAuctionNounId, lastAuctionStartTime, dispatch, initialAuctionId, onDisplayAuction]);

  const isActiveAuction =
    onDisplayAuctionNounId === lastAuctionNounId || typeof onDisplayAuctionNounId === 'undefined';

  return (
    <>
      <Auction auction={onDisplayAuction} isActive={isActiveAuction} />

      {isActiveAuction && <AuctionPreviousNouns />}

      {isActiveAuction ? <Banner /> : <ProfileActivityFeed nounId={onDisplayAuctionNounId} />}

      <Documentation />
    </>
  );
};
export default AuctionPage;
