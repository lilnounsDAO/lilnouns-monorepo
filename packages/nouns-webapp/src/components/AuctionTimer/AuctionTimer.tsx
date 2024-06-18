import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useRef, useState } from 'react';

dayjs.extend(duration);

export const AuctionTimer: React.FC<{
  startTime: number;
  updateInterval: number;
}> = props => {
  const { startTime, updateInterval } = props;

  const [auctionTimer, setAuctionTimer] = useState(0);
  const [showDuration, setShowDuration] = useState(true);

  const auctionTimerRef = useRef(auctionTimer);
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const dropTime = dayjs().add(auctionTimerRef.current, 's').local();
  const startDate = new Date(startTime * 1000);

  const currentTime = new Date();

  // Calculate the elapsed time since the start of the auction
  const elapsedTime = currentTime.getTime() - startDate.getTime();

  // Calculate the number of times the price has dropped (rounded down to the nearest integer)
  const numPriceDrops = Math.floor(elapsedTime / (updateInterval * 1000));
  const priceDropsIn = new Date(
    startDate.getTime() + (numPriceDrops + 1) * (updateInterval * 1000),
  );

  // timer logic
  useEffect(() => {
    const timeLeft = priceDropsIn.getTime() - new Date().getTime();

    setAuctionTimer(timeLeft / 1000);

    if (timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [priceDropsIn]);

  const minutes = Math.floor(timerDuration.minutes());
  const seconds = Math.floor(timerDuration.seconds());

  return (
    <div className="cursor-pointer" onClick={() => setShowDuration(c => !c)}>
      {showDuration && (
        <>
          <span className="tabular-nums">{minutes}</span>m{' '}
          <span className="tabular-nums">{seconds}</span>s
        </>
      )}
      {!showDuration && <>{dropTime.format('h:mm:ss a')}</>}
    </div>
  );
};
