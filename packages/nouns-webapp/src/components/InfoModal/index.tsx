import classes from './InfoModal.module.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import Link from '../Link';

export const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const InfoModalOverlay: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;

  const lilBlockPartyLink = (
    <Link text="Lil Block Party" url="https://lilblockparty.wtf" leavesPage={true} />
  );

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>

      <div className={classes.modal}>
        <div className={classes.content}>
          <div className={classes.bidWrapper}>
            <div className={classes.header}>
              <div className={classes.title}>
                <h2>Info</h2>
                <h1>Bidding and Settling</h1>
              </div>
            </div>
            <div>Connect your wallet to make bids or settle Lil Noun auctions.</div>
            <div className={classes.headerText}>Settlement</div>
            Anyone can settle an auction. When an auction ends, a gas-only transaction is required
            to start the next auction and mint the current Lil Noun to the winners wallet. As gas
            price fluctuates, the cost of settlement also fluctuates.
            <br />
            <br />
            Settlement gas price of every 9th Lil Noun is higher. This is due to the transaction
            also triggering 2 free Lil Noun mints: The Lil Nounders mint and The Nouns DAO mint.
            <br />
            <div className={classes.subheaderText}>Settling Auctions through Lil Block Party</div>
            Lil Nouns currently utilises a community built app called {lilBlockPartyLink} to settle
            its auctions.
            <br />
            <br />
            Lil Block Party gives prospective bidders the opportunity to select which Lil Noun
            they'd like to see auctioned next. It does this by monitoring Lil Noun seed changes per
            new ethereum block created. We recommend prospective bidders pick their favourite Lil
            Nouns pre-settlement via Lil Block Party.
            <br />
            <br />
            Alternatively, auction winners that solely care to mint the current Lil Noun to their
            wallet, can settle manually.
            <br />
            <br />
            <div className={classes.headers}>Bids</div>
            Once an auction starts, everyone has 15 minutes to bid. Anyone can bid an amount
            at/above 0.15 eth. The Amount bid is returned to bidder if they lose the auction (minus
            gas spent on bid transaction).
            <br />
            <br />
            Bids at the very last minute increase the auction time by 1 and a half minutes.
            Sometimes, multiple bids are sent at the same time. This may result in bids coming in
            and winning an auction at the very last minute/seconds (irrespective of time increase).
            <br />
            <div className={classes.headerText}>Bid Refunds</div>
            Unsuccessful bids are refunded in full. The timing of refunds may be offset by 1 bidder.
            This means that a refund is processed for an unsuccessful bid, when a higher bid is
            submitted.
          </div>
        </div>
      </div>
    </>
  );
};

const InfoModal: React.FC<{
  onDismiss: () => void;
}> = props => {
  const { onDismiss } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <InfoModalOverlay onDismiss={onDismiss} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default InfoModal;
