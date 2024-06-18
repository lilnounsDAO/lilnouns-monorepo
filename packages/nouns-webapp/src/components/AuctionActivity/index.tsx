import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import config from '../../config';
import { useAppSelector } from '../../hooks';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { isVrgdaNoun } from '../../utils/vrgdaAuction';
import { Auction } from '../../wrappers/nounsAuction';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import Bid from '../Bid';
import BidHistory from '../BidHistory';
import BidHistoryBtn from '../BidHistoryBtn';
import BidHistoryModal from '../BidHistoryModal';
import CurrentBid from '../CurrentBid';
import NounInfoCard from '../NounInfoCard';
import Winner from '../Winner';
import classes from './AuctionActivity.module.css';
import bidHistoryClasses from './BidHistory.module.css';

const openEtherscanBidHistory = () => {
  const url = buildEtherscanAddressLink(config.addresses.nounsAuctionHouseProxy);
  window.open(url);
};

interface AuctionActivityProps {
  auction: Auction;
  displayGraphDepComps: boolean;
}

const AuctionActivity: React.FC<AuctionActivityProps> = (props: AuctionActivityProps) => {
  const { auction, displayGraphDepComps } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const isLastAuction = auction.nounId.toNumber() === lastNounId;
  const isVrgda = isVrgdaNoun(auction.nounId.toNumber());

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);

  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  return (
    <>
      {showBidHistoryModal && (
        <BidHistoryModal onDismiss={dismissBidModalHanlder} auction={auction} />
      )}

      <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <AuctionTitleAndNavWrapper>
              {displayGraphDepComps && <AuctionNavigation nounId={auction.nounId.toNumber()} />}
              <AuctionActivityDateHeadline startTime={auction.startTime} />
            </AuctionTitleAndNavWrapper>
            <Col lg={12}>
              <AuctionActivityNounTitle isCool={isCool} nounId={auction.nounId} />
            </Col>
          </Row>
          <Row className={classes.activityRow}>
            <Col lg={4} className={classes.currentBidCol}>
              <CurrentBid
                currentBid={new BigNumber(auction.amount.toString())}
                auctionEnded
                isVrgda={isVrgda}
              />
            </Col>
            <Col lg={6} className={classes.auctionTimerCol}>
              <Winner winner={auction.bidder || ''} />
            </Col>
          </Row>
        </div>
        {isLastAuction && (
          <>
            <Row className={classes.activityRow}>
              <Col lg={12}>
                <Bid auction={auction} auctionEnded />
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
            {/* If no bids, show nothing. If bids avail:graph is stable? show bid history modal,
            else show etherscan contract link */}
            {isLastAuction &&
              !auction.amount.eq(0) &&
              (displayGraphDepComps ? (
                <BidHistoryBtn onClick={showBidModalHandler} />
              ) : (
                <BidHistoryBtn onClick={openEtherscanBidHistory} />
              ))}
          </Col>
        </Row>
      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
