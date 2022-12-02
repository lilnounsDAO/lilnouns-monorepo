import { useState, useEffect, useRef } from 'react';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionSettlementBtnGroup.module.css';
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';
import { CHAIN_ID } from '../../config';

const AuctionSettlementBtnGroup: React.FC<{
  settleAuctionHandler: () => void;
  auction: Auction;
}> = props => {
  const { settleAuctionHandler, auction } = props;

  const lbpBtnOnClickHandler = () => {
    // Open lbp in a new tab
    window.open('https://lilblockparty.wtf/', '_blank')?.focus();
  };

  const isNextAuctionNounderNoun = Number(auction.nounId) % 10 == 9

  return (
    <>
      {!isNextAuctionNounderNoun ? (
        <Button className={classes.bidBtnAuctionEnded} onClick={settleAuctionHandler}>
          Settle Manually
        </Button>
      ) : (
        <div className={classes.nounButtonContents}>
          <Button
            className={classes.bidBtnAuctionEnded}
            onClick={settleAuctionHandler}
          >
            I'm feeling lucky
          </Button>

          <div className={classes.divider} />

          <Button className={classes.bidBtnAuctionEnded} onClick={lbpBtnOnClickHandler}>
          Pick the next Lil Noun
          </Button>
        </div>
      )}
    </>
  );
};

export default AuctionSettlementBtnGroup;
