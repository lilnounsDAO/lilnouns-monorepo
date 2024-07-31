import { BigNumber } from 'ethers';
import { Col, Row } from 'react-bootstrap';
import { Link as DocLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import auctionActivityClasses from '../AuctionActivity/AuctionActivity.module.css';
import auctionBidClasses from '../AuctionActivity/BidHistory.module.css';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import bidBtnClasses from '../BidHistoryBtn/BidHistoryBtn.module.css';
import CurrentBid, { BID_N_A } from '../CurrentBid';
import Link from '../Link';
import Winner from '../Winner';
import nounContentClasses from './NounderNounContent.module.css';
import { isVrgdaNoun } from '../../utils/vrgdaAuction';

const NounderNounContent: React.FC<{
  mintTimestamp: BigNumber;
  nounId: BigNumber;
}> = props => {
  const { mintTimestamp, nounId } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const isVrgda = isVrgdaNoun(nounId.toNumber());

  const nounIdNumber: number = nounId.toNumber();
  let block: any;
  let isNoundersNoun = false;
  let isNounsDAONoun = false;

  const nounsDao = <Link text="Nouns DAO" url="https://nouns.wtf" leavesPage={true} />;

  if (nounIdNumber % 10 === 0) {
    isNoundersNoun = true;
    isNounsDAONoun = false;

    block = (
      <ul className={auctionBidClasses.bidCollection}>
        <li
          className={
            (isCool ? `${auctionBidClasses.bidRowCool}` : `${auctionBidClasses.bidRowWarm}`) +
            ` ${nounContentClasses.bidRow}`
          }
        >
          All Noun auction proceeds are sent to the{' '}
          <DocLink to="/vote" className={nounContentClasses.link}>
            Lil Nouns DAO
          </DocLink>
          . For this reason, we, the project's founders (‘Lil Nounders’) have chosen to compensate
          ourselves with Lil Nouns. Every 10th Lil Noun for the first 5 years of the project will be
          sent to our multisig, where it will be vested and distributed to individual Nounders.
        </li>
      </ul>
    );
  }

  if (nounIdNumber % 10 === 1) {
    isNoundersNoun = false;
    isNounsDAONoun = true;

    block = (
      <ul className={auctionBidClasses.bidCollection}>
        <li
          className={
            (isCool ? `${auctionBidClasses.bidRowCool}` : `${auctionBidClasses.bidRowWarm}`) +
            ` ${nounContentClasses.bidRow}`
          }
        >
          As a thank you to the {nounsDao} for being selfless stewards of cc0 we, the project's
          founders (‘Lil Nounders’) have chosen to compensate the NounsDAO with Lil Nouns. Every
          11th Lil Noun for the first 5 years of the project will be sent to the NounsDAO, where
          they'll be distributed to individual Nouns, Nounders, and community members alike.
        </li>
      </ul>
    );
  }

  return (
    <AuctionActivityWrapper>
      <div className={auctionActivityClasses.informationRow}>
        <Row className={auctionActivityClasses.activityRow}>
          <AuctionTitleAndNavWrapper>
            <AuctionNavigation nounId={nounId.toNumber()} />
            <AuctionActivityDateHeadline startTime={mintTimestamp} />
          </AuctionTitleAndNavWrapper>
          <Col lg={12}>
            <AuctionActivityNounTitle nounId={nounId} />
          </Col>
        </Row>
        <Row className={auctionActivityClasses.activityRow}>
          <Col lg={4} className={auctionActivityClasses.currentBidCol}>
            <CurrentBid currentBid={BID_N_A} auctionEnded={true} isVrgda={isVrgda} />
          </Col>
          <Col
            lg={5}
            className={`${auctionActivityClasses.currentBidCol} ${nounContentClasses.currentBidCol} ${auctionActivityClasses.auctionTimerCol}`}
          >
            <div className={auctionActivityClasses.section}>
              <Winner winner={''} isNounders={isNoundersNoun} isNounsDAO={isNounsDAONoun} />
            </div>
          </Col>
        </Row>
      </div>
      <Row className={auctionActivityClasses.activityRow}>
        <Col lg={12}>
          {block}

          <div
            className={
              isCool ? bidBtnClasses.bidHistoryWrapperCool : bidBtnClasses.bidHistoryWrapperWarm
            }
          >
            {nounIdNumber % 10 === 0 ? (
              // <DocLink
              //   to="/lilnounders"
              //   className={isCool ? bidBtnClasses.bidHistoryCool : bidBtnClasses.bidHistoryWarm}
              // >
              //   Learn more →
              // </DocLink>
              <></>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
