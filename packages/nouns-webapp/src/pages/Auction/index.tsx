import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId, setOnDisplayAuctionStartTime } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';

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

      // handle out of bounds noun path ids
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

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionNounId && onDisplayAuctionNounId !== lastAuctionNounId ? (
        <ProfileActivityFeed nounId={onDisplayAuctionNounId} />
      ) : (
        <Banner />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
