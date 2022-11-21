import { Auction, VrgdaAuction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import bidHistoryClasses from './BidHistory.module.css';
import Buy from '../Buy';
import AuctionTimer from '../AuctionTimer';
import CurrentPrice from '../CurrentPrice';
import Winner from '../Winner';
import BidHistory from '../BidHistory';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import NounInfoCard from '../NounInfoCard';
import { useAppSelector } from '../../hooks';
import BidHistoryModal from '../BidHistoryModal';
import BlockTimer from '../BlockTimer';
import PriceRange from '../PriceRange';

const openEtherscanBidHistory = () => {
  const url = buildEtherscanAddressLink(config.addresses.nounsAuctionHouseProxy);
  window.open(url);
};

interface AuctionActivityProps {
  auction: VrgdaAuction;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
  displayGraphDepComps: boolean;
}

const AuctionActivity: React.FC<AuctionActivityProps> = (props: AuctionActivityProps) => {
  const {
    auction,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
    displayGraphDepComps,
  } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  // timer logic - check auction status every 30 seconds, until five minutes remain, then check status every second
  useEffect(() => {
    if (!auction) return;

    const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

    if (auction && timeLeft <= 0) {
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(
        () => {
          setAuctionTimer(!auctionTimer);
        },
        timeLeft > 300 ? 30000 : 1000,
      );

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auctionTimer, auction]);

  if (!auction) return null;

  console.log('auction.amount', auction.amount.toString());

  return (
    <>
      {showBidHistoryModal && (
        <BidHistoryModal onDismiss={dismissBidModalHanlder} auction={auction} />
      )}

      <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <AuctionTitleAndNavWrapper>
              {displayGraphDepComps && (
                <AuctionNavigation
                  isFirstAuction={isFirstAuction}
                  isLastAuction={isLastAuction}
                  onNextAuctionClick={onNextAuctionClick}
                  onPrevAuctionClick={onPrevAuctionClick}
                />
              )}
              <AuctionActivityDateHeadline startTime={auction.startTime} />
            </AuctionTitleAndNavWrapper>
            <Col lg={12}>
              <AuctionActivityNounTitle isCool={isCool} nounId={auction.nounId} />
            </Col>
          </Row>
          <Row className={classes.activityRow}>
            <Col lg={3} className={classes.currentBidCol}>
              <CurrentPrice
                currentPrice={new BigNumber(auction.amount.toString())}
                auctionEnded={auctionEnded}
              />
            </Col>
            <Col lg={5} className={classes.auctionTimerCol}>
              {auctionEnded ? (
                <Winner winner={auction.bidder} />
              ) : (
                <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
              )}
            </Col>
            {!auctionEnded && (
              <Col lg={4} className={classes.blockTimerCol}>
                {<BlockTimer auction={auction} auctionEnded={auctionEnded} />}
              </Col>
            )}
          </Row>
        </div>
        <div className="my-8">
          <PriceRange auction={auction} />
        </div>
        {isLastAuction && (
          <>
            <Row className={classes.activityRow}>
              <Col lg={12}>
                <Buy auction={auction} auctionEnded={auctionEnded} />
              </Col>
            </Row>
          </>
        )}
        <Row className={classes.activityRow}>
          <Col lg={12}>
            {!isLastAuction ? (
              <NounInfoCard
                nounId={auction.nounId.toNumber()}
                bidHistoryOnClickHandler={showBidModalHandler}
              />
            ) : (
              displayGraphDepComps && (
                <BidHistory
                  auctionId={auction.nounId.toString()}
                  max={3}
                  classes={bidHistoryClasses}
                />
              )
            )}
          </Col>
        </Row>
      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
