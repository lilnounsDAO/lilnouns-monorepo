import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import bidHistoryClasses from './BidHistory.module.css';
import Buy from '../Buy';
import AuctionTimer from '../AuctionTimer';
import CurrentPrice from '../CurrentPrice';
import Winner from '../Winner';

import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import NounInfoCard from '../NounInfoCard';
import { useAppSelector } from '../../hooks';
import PriceRange from '../PriceRange';

const openEtherscanBidHistory = () => {
  const url = buildEtherscanAddressLink(config.addresses.nounsAuctionHouseProxy);
  window.open(url);
};

interface AuctionActivityProps {
  auction: Auction;
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

  return (
    <>
      <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <AuctionTitleAndNavWrapper>
              {/* {displayGraphDepComps && (
                <AuctionNavigation
                  isFirstAuction={isFirstAuction}
                  isLastAuction={isLastAuction}
                  onNextAuctionClick={onNextAuctionClick}
                  onPrevAuctionClick={onPrevAuctionClick}
                />
              )} */}
              <AuctionActivityDateHeadline startTime={auction.startTime} />
            </AuctionTitleAndNavWrapper>
            <Col lg={12}>
              <AuctionActivityNounTitle isCool={isCool} nounId={auction.nounId} />
            </Col>
          </Row>
          <Row className={classes.activityRow}>
            <Col lg={4} className={classes.currentBidCol}>
              <CurrentPrice
                currentPrice={new BigNumber(auction.amount.toString())}
                auctionEnded={auctionEnded}
              />
            </Col>
            <Col lg={6} className={classes.auctionTimerCol}>
              {auctionEnded && auction?.bidder ? (
                <Winner winner={auction.bidder} />
              ) : (
                <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
              )}
            </Col>
          </Row>
        </div>
        {isLastAuction && (
          <>
            <Row className={classes.activityRow}>
              <Col lg={12}>
                <div className="flex flex-col space-y-4">
                  <PriceRange auction={auction} />

                  <Buy auction={auction} auctionEnded={auctionEnded} />
                </div>
              </Col>
            </Row>
          </>
        )}
        <Row className={classes.activityRow}>
          <Col lg={12}>
            {!isLastAuction && (
              <NounInfoCard
                seed={auction.seed}
                svg={auction.svg}
                nounId={auction.nounId.toNumber()}
                bidHistoryOnClickHandler={showBidModalHandler}
              />
            )}
          </Col>
        </Row>
      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
