import { BigNumber } from 'ethers';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setStateBackgroundColor } from '../../state/slices/application';
import { beige, grey } from '../../utils/nounBgColors';
import { isNounderNoun, isNounsDAONoun } from '../../utils/nounderNoun';
import { INounSeed } from '../../wrappers/nounToken';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import AuctionActivity from '../AuctionActivity';
import { AuctionNextNoun } from '../AuctionNextNoun/AuctionNextNoun';
import { LoadingNoun } from '../Noun';
import NounderNounContent from '../NounderNounContent';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import classes from './Auction.module.css';

interface AuctionProps {
  auction?: IAuction;
  isActive?: boolean;
}

const Auction = (props: AuctionProps) => {
  const { auction, isActive = false } = props;

  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const nextNoun = useAppSelector(state => state.auction.nouns?.next);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {auction ? (
              <div className={classes.nounWrapper}>
                <StandaloneNounWithSeed
                  nounId={auction.nounId}
                  onLoadSeed={loadedNounHandler}
                  shouldLinkToProfile={false}
                  seed={isActive && nextNoun ? nextNoun.seed : undefined}
                />
              </div>
            ) : (
              <div className={classes.nounWrapper}>
                <LoadingNoun />
              </div>
            )}
          </Col>
          {auction && (
            <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
              {isActive && <AuctionNextNoun auction={auction} />}
              {!isActive &&
                (isNounderNoun(auction.nounId) || isNounsDAONoun(auction.nounId) ? (
                  <NounderNounContent mintTimestamp={auction.startTime} nounId={auction.nounId} />
                ) : (
                  <AuctionActivity auction={auction} displayGraphDepComps={true} />
                ))}
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
