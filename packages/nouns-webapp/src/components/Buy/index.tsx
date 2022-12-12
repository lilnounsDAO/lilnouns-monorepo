import { useEthers, useContractFunction } from '@usedapp/core';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { utils, BigNumber as EthersBN, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Buy.module.css';
import { Spinner, InputGroup, Button } from 'react-bootstrap';
import { Auction, useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { NounsAuctionHouseFactory } from '@lilnounsdao/sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import InfoModal from '../InfoModal';
import AUCTION_ABI from '../../libs/abi/vrgda.json';
import { useAccount, useConnect, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { InjectedConnector } from '@wagmi/core';

const INFURA_PROVIDER = new ethers.providers.InfuraProvider(
  'goerli',
  `819b435e5ebc4e8386b89e79c4d5d7ec`,
);

const vrgdaContract = new ethers.Contract(
  '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
  AUCTION_ABI,
  INFURA_PROVIDER,
);

const Buy: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  const { auction, auctionEnded } = props;
  console.log('auction', auction);
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log('address', address);
  console.log('isConnecting', isConnecting);
  console.log('isDisconnected', isDisconnected);
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
    config.addresses.nounsAuctionHouseProxy,
  );

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');
  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? 'Settle' : 'Buy Now',
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const args = [2, auction.parentBlockHash];

  const { write } = useContractWrite({
    address: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
    abi: AUCTION_ABI,
    functionName: 'settleAuction',
    args,
    chainId: 5,
    mode: 'recklesslyUnprepared',
    overrides: {
      gasLimit: 5000000 as any,
      maxFeePerGas: 2000000000 as any,
    },
  });

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const buyNounHandler = async () => {
    if (!address) {
      await connectAsync();
    }
    if (write) {
      console.log('buying noun');
      // if (write) {
      console.log('calling write');
      // write();
      // }
      console.log(vrgdaContract);

      // const nounId = 2;

      // const tx = await vrgdaContract.settleAuction(auction.amount, nounId, auction.parentBlockHash);
      // console.log(tx);

      write?.();
    }
  };
  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  //TODO: Refactor Modal to utilitse new modal design
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  if (!auction) return null;

  const isDisabled = false;
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
            <Button
              className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
              onClick={buyNounHandler}
              disabled={!write}
            >
              {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
            </Button>
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Buy;
