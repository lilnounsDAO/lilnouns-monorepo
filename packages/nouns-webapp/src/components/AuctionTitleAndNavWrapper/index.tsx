import { Col } from 'react-bootstrap';
import classes from './AuctionTitleAndNavWrapper.module.css';

// eslint-disable-next-line @typescript-eslint/ban-types
const AuctionTitleAndNavWrapper: React.FC<{}> = props => {
  return (
    <Col lg={12} className={classes.auctionTitleAndNavContainer}>
      {props.children}
    </Col>
  );
};
export default AuctionTitleAndNavWrapper;
