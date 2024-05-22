import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ nounId: number; isCool?: boolean }> = props => {
  const { nounId, isCool } = props;
  const nounIdContent = `Lil Noun ${nounId}`;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        {nounIdContent}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
