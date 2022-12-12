import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BidHistoryModal from '../BidHistoryModal';
import PriceDropModal from '../PriceDropModal';

dayjs.extend(duration);

const AuctionTimer: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const { auction, auctionEnded } = props;

  const [auctionTimer, setAuctionTimer] = useState(0);
  const [timerToggle, setTimerToggle] = useState(true);

  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const dropTime = dayjs().add(auctionTimerRef.current, 's').local();

  // Get the start time and update interval in seconds
  const updateIntervalSeconds = auction.updateInterval.toNumber();
  const startTime = new Date(auction.startTime.toNumber() * 1000);
  console.log('startTime, updateInterval', startTime, updateIntervalSeconds);

  // Get the current time
  const currentTime = new Date();

  // Calculate the elapsed time since the start of the auction
  const elapsedTime = currentTime.getTime() - startTime.getTime();

  // Calculate the number of times the price has dropped
  const numPriceDrops = elapsedTime / (updateIntervalSeconds * 1000);

  // Calculate the time since the last price drop
  const timeSinceLastPriceDrop = numPriceDrops * (updateIntervalSeconds * 1000);

  // Calculate the time until the next price drop
  const timeUntilNextPriceDrop = updateIntervalSeconds * 1000 - timeSinceLastPriceDrop;

  // Calculate the "price drops in" date by adding the time until the next price drop to the current time
  const priceDropsIn = new Date(currentTime.getTime() + timeUntilNextPriceDrop);

  // timer logic
  useEffect(() => {
    console.log('priceDropsIn', priceDropsIn);
    const timeLeft = (auction && Number(priceDropsIn)) - dayjs().unix();

    setAuctionTimer(auction && timeLeft);

    if (auction && timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const auctionContentLong = auctionEnded ? 'Auction ended' : 'Price drops in';
  const auctionContentShort = auctionEnded ? 'Auction ended' : 'Price drops in';

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());
  const isCool = useAppSelector(state => state.application.isCoolBackground);

  if (!auction) return null;

  const [showPriceDropModal, setShowPriceDropModal] = useState(false);
  const showPriceDropHandler = () => {
    setShowPriceDropModal(true);
  };
  const dismissPriceDropModal = () => {
    setShowPriceDropModal(false);
  };

  return (
    <>
      {showPriceDropModal && <PriceDropModal onDismiss={dismissPriceDropModal} />}

      <Row
        className={clsx(classes.wrapper, classes.section)}
        onClick={e => {
          if (e.target !== this) return;
          setTimerToggle(!timerToggle);
        }}
      >
        <Col xs={timerToggle ? 4 : 6} lg={12} className={classes.leftCol}>
          <div className="flex items-center space-x-2">
            <h4
              className="mb-0"
              style={{
                color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
              }}
            >
              {timerToggle
                ? window.innerWidth < 992
                  ? auctionContentShort
                  : auctionContentLong
                : `Ends on ${dropTime.format('MMM Do')} at`}
            </h4>
            <button onClick={showPriceDropHandler} className={classes.infoButton}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>
        </Col>
        <Col xs="auto" lg={12}>
          {timerToggle ? (
            <h2
              className={clsx(classes.timerWrapper, classes.timeLeft)}
              style={{
                color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
              }}
            >
              <div className={classes.timerSection}>
                <span>
                  {`${flooredMinutes}`}
                  <span className={classes.small}>m</span>
                </span>
              </div>
              <div className={classes.timerSectionFinal}>
                <span>
                  {`${flooredSeconds}`}
                  <span className={classes.small}>s</span>
                </span>
              </div>
            </h2>
          ) : (
            <h2
              className={classes.timerWrapper}
              style={{
                color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
              }}
            >
              <div className={clsx(classes.timerSection, classes.clockSection)}>
                <span>{dropTime.format('h:mm:ss a')}</span>
              </div>
            </h2>
          )}
        </Col>
      </Row>
    </>
  );
};

export default AuctionTimer;
