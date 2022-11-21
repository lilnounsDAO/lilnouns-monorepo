import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction, VrgdaAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { INounSeed } from '../../wrappers/nounToken';
import NounderNounContent from '../NounderNounContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isNounderNoun, isNounsDAONoun } from '../../utils/nounderNoun';
import {
  setNextOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
} from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/nounBgColors';
import { useContractReads } from 'wagmi';
import { NounsVRGDAAuctionHouseABI } from '../../pages/Auction/vrgdaABI';
import { BigNumber } from 'ethers';

export const vrgdaAuctionHouseContract = {
  addressOrName: '0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44',
  contractInterface: NounsVRGDAAuctionHouseABI,
};

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { data } = useContractReads({
    contracts: [
      {
        ...vrgdaAuctionHouseContract,
        functionName: 'updateInterval',
      },
      {
        ...vrgdaAuctionHouseContract,
        functionName: 'startTime',
      },
      {
        ...vrgdaAuctionHouseContract,
        functionName: 'fetchNextNoun',
      },
    ],
  });
  const updateInterval = data?.[0] as unknown as BigNumber;
  const startTime = data?.[1] as unknown as BigNumber;
  const nextNoun = data?.[2] as any;
  console.log('data', data);

  const currentAuction: VrgdaAuction = {
    nounId: nextNoun?.nounId,
    startTime: startTime as unknown as BigNumber,
    endTime: nextNoun?.endTime || nextNoun?.price,
    amount: nextNoun?.price,
    bidder: nextNoun?.bidder || 0x01,
    settled: nextNoun?.settled || false,
    updateInterval: updateInterval,
  };

  console.log('vrgdaAuction', currentAuction);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastNounId = 2;
  const isLastAuction = currentAuction.nounId.eq(lastNounId);

  console.log('lastNounId', lastNounId);
  console.log(isLastAuction);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionNounId());
    currentAuction && history.push(`/lilnoun/${currentAuction.nounId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionNounId());
    currentAuction && history.push(`/lilnoun/${currentAuction.nounId.toNumber() + 1}`);
  };

  const nounContent = currentAuction && (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed
        nounId={currentAuction.nounId}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <LoadingNoun />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderNounContent = currentAuction && (
    <NounderNounContent
      mintTimestamp={currentAuction.startTime}
      nounId={currentAuction.nounId}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );
  //TODO:: come back to this

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {currentAuction ? nounContent : loadingNoun}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderNoun(currentAuction.nounId) || isNounsDAONoun(currentAuction.nounId)
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
