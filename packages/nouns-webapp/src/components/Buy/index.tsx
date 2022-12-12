import { useAppSelector } from '../../hooks';
import React, { useState, useRef } from 'react';

import classes from './Buy.module.css';
import { Spinner, InputGroup, Button } from 'react-bootstrap';
import { Auction } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';

import { NounsAuctionHouseFactory } from '@lilnounsdao/sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import InfoModal from '../InfoModal';
import AUCTION_ABI from '../../libs/abi/vrgda.json';
import { useAccount, useConnect, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { InjectedConnector } from '@wagmi/core';
import { ethers } from 'ethers';

const Buy: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const { auction, auctionEnded } = props;

  const { address } = useAccount();

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

  const [parentHash, setParentHash] = useState('');

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    `wUfyWSOTH6JHCAlZykmSDjnTBV7MP12H`,
  );

  const getParentHash = async () => {
    const block = await provider.getBlock('pending');
    return block.parentHash;
  };

  const args = [2, parentHash];

  const { write } = useContractWrite({
    address: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
    abi: AUCTION_ABI,
    functionName: 'settleAuction',
    args,
    chainId: 5,
    mode: 'recklesslyUnprepared',
    overrides: {
      gasLimit: 5000000 as any,
      maxFeePerGas: 10000000000 as any,
      from: address,
      value: auction.amount,
    },
  });

  const dispatch = useAppDispatch();

  const buyNounHandler = async () => {
    if (!address) {
      await connectAsync();
    }
    if (write) {
      getParentHash().then(response => {
        setParentHash(response);
      });
      console.log(parentHash);
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
