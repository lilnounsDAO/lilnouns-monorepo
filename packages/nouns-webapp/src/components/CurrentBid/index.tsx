import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';

/**
 * Passible to CurrentBid as `currentBid` prop to indicate that
 * the bid amount is not applicable to this auction. (Nounder Noun)
 */
export const BID_N_A = 'n/a';

/**
 * Special Bid type for not applicable auctions (Nounder Nouns)
 */
type BidNa = typeof BID_N_A;

const CurrentBid: React.FC<{
  currentBid: BigNumber | BidNa;
  auctionEnded: boolean;
  isVrgda: boolean;
}> = props => {
  const { currentBid, auctionEnded, isVrgda } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const titleContent = auctionEnded ? (isVrgda ? 'Price' : 'Winning bid') : 'Current bid';

  return (
    <Row className={clsx(classes.wrapper, classes.container, classes.section)}>
      <Col xs={5} lg={12} className={classes.leftCol}>
        <h4
          style={{
            color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
          }}
        >
          {titleContent}
        </h4>
      </Col>
      <Col xs="auto" lg={12}>
        <h2
          className={classes.currentBid}
          style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}
        >
          {currentBid === BID_N_A || (auctionEnded && currentBid.isZero()) ? (
            BID_N_A
          ) : (
            <TruncatedAmount amount={currentBid} decimals={3} />
          )}
        </h2>
      </Col>
    </Row>
  );
};

export default CurrentBid;
