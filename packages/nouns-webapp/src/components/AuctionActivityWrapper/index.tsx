import classes from './AuctionActivityWrapper.module.css';

// eslint-disable-next-line @typescript-eslint/ban-types
const AuctionActivityWrapper: React.FC<{}> = props => {
  return <div className={classes.wrapper}>{props.children}</div>;
};
export default AuctionActivityWrapper;
