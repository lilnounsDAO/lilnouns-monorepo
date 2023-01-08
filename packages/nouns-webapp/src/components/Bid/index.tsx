import { Auction, AuctionHouseContractFunction } from '../../wrappers/nounsAuction';
import { connectContractToSigner, useEthers, useContractFunction } from '@usedapp/core';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import { utils, BigNumber as EthersBN } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button, Col, Nav } from 'react-bootstrap';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { NounsAuctionHouseFactory } from '@lilnounsdao/sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import SettleManuallyBtn from '../SettleManuallyBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import InfoModal from '../InfoModal';
import AuctionSettlementBtnGroup from '../AuctionSettlementBtnGroup';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  if (!minBidIncPercentage) {
    return new BigNumber(0);
  }
  return currentBid
    .times(minBidIncPercentage.div(100).plus(1))
    .decimalPlaces(0, BigNumber.ROUND_UP);
};

//Using current bid, calculates fat finger threshold fo next bid
const computeFatFingerNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  return !minBidIncPercentage ? new BigNumber(0) : currentBid.times(10);
};

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.15';
  }

  const eth = utils.formatEther(EthersBN.from(minBid.toString()));
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL);
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return new BigNumber(0);
  }
  return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
};

const Bid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  const { auction, auctionEnded } = props;

  const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
    config.addresses.nounsAuctionHouseProxy,
  );

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');
  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? 'Settle' : 'Place bid',
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const fatFingerBid = computeFatFingerNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const { send: placeBid, state: placeBidState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.createBid,
  );
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  );

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef).isLessThan(minBid)) {
      setModal({
        show: true,
        title: 'Insufficient bid amount 🤏',
        message: `Please place a bid higher than or equal to the minimum bid amount of ${minBidEth(
          minBid,
        )} ETH.`,
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = utils.parseEther(bidInputRef.current.value.toString());
    const contract = connectContractToSigner(nounsAuctionHouseContract, undefined, library);
    const gasLimit = await contract.estimateGas.createBid(auction.nounId, {
      value,
    });

    const placeBidWarned = () => {
      placeBid(auction.nounId, {
        value,
        gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
      });
    };

    //TODO: fat finger check here 900% increase
    //Operator '>' cannot be applied to types 'BigNumber' and 'number'.
    
    //0.15 = 150000000000000000
    //1.5 = 1500000000000000000
    if (
      minBid.gt('150000000000000000') &&
      value.gte('1500000000000000000') &&
      value.gte(fatFingerBid.toString())
    ) {
      setModal({
        show: true,
        title: `Woah there!`,
        message: `The bid you're about to place is ${utils.formatEther(
          value,
        )} ETH which is over 10x the bid before. Sure this wasn't fat-fingered?`,
        isActionPrompt: true,
        actionMessage: 'Place bid',
        action: placeBidWarned,
      });
    } else {
      placeBid(auction.nounId, {
        value,
        gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
      });
    }
  };

  const settleAuctionHandlerFunc = () => {
    settleAuction()
  };

  const settleAuctionHandler = () => {
    //settleAuction()
    setModal({
      show: true,
      title: `Reminder`,
      message: `Settling this auction starts the next auction at a 0.15 eth minimum bid. Only settle if you plan on bidding for the next Lil Noun!`,
      isActionPrompt: true,
      actionMessage: 'Settle Auction',
      action: settleAuctionHandlerFunc,
    });

  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = placeBidState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      placeBidState.status = 'Success';
      setModal({
        title: 'Success',
        message: `Bid was placed successfully!`,
        isMilestone: auction.amount.toString().includes('69'),
        show: true,
      });
      setBidButtonContent({ loading: false, content: 'Place bid' });
      clearBidInput();
    }
  }, [auction, placeBidState, account, setModal]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && placeBidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Place bid',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
    }
  }, [placeBidState, auctionEnded, setModal]);

  //TODO: Refactor Modal to utilitse new modal design
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  // settle auction transaction state hook
  useEffect(() => {
    switch (auctionEnded && settleAuctionState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Settle Auction',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Success':
        setModal({
          title: 'Success',
          message: `Settled auction successfully!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
    }
  }, [settleAuctionState, auctionEnded, setModal]);

  if (!auction) return null;

  const isDisabled =
    placeBidState.status === 'Mining' || settleAuctionState.status === 'Mining' || !activeAccount;

  const minBidCopy = `Ξ ${minBidEth(minBid)} or more`;

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      {showBidHistoryModal && <InfoModal onDismiss={dismissBidModalHanlder} />}

      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span className={classes.customPlaceholderBidAmt}>
              {!auctionEnded && !bidInput ? minBidCopy : ''}
            </span>
            <FormControl
              className={classes.bidInput}
              onWheel={event => event.currentTarget.blur()}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          <>
            <Button
              className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
              onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
              disabled={isDisabled}
            >
              {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
            </Button>
          </>
        ) : (
          <>
            {/* Only show force settle button if wallet connected */}
            {isWalletConnected ? (
              <Col lg={12}>
                <AuctionSettlementBtnGroup
                  settleAuctionHandler={settleAuctionHandler}
                  auction={auction}
                />

                <button onClick={showBidModalHandler} className={classes.infoButton}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  {` bidding and settling`}
                </button>
              </Col>
            ) : (
              <>
                <Col lg={12}>
                  <button onClick={showBidModalHandler} className={classes.infoButton}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {` bidding and settling`}
                  </button>
                </Col>
              </>
            )}
          </>
        )}
      </InputGroup>

      {!auctionEnded ? (
        <Col lg={11} style={{ paddingTop: '0.5em' }}>
          <button onClick={showBidModalHandler} className={classes.infoButton}>
            <FontAwesomeIcon icon={faInfoCircle} />
            {` bidding and settling`}
          </button>
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};
export default Bid;
