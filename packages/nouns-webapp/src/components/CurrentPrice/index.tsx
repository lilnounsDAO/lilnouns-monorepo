import BigNumber from 'bignumber.js';
import classes from './CurrentPrice.module.css';
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

const CurrentPrice: React.FC<{
  currentPrice: BigNumber | BidNa;
  auctionEnded: boolean;
}> = props => {
  const { currentPrice, auctionEnded } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const titleContent = auctionEnded ? 'Price' : 'Price';

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
          {currentPrice === BID_N_A ? (
            BID_N_A
          ) : (
            <TruncatedAmount amount={currentPrice && currentPrice} />
          )}
        </h2>
      </Col>
    </Row>
  );
};

export default CurrentPrice;
