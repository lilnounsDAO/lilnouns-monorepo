import { StandaloneBigNounCircular } from '../StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounImageInlineTable.module.css';
import { GrayCircle } from '../GrayCircle';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';

interface NounImageInlineTableTableProps {
  nounIds: string[];
}
const NOUNS_PER_VOTE_CARD_DESKTOP = 7;

const isXLScreen = window.innerWidth > 1200;

const NounImageInlineTable: React.FC<NounImageInlineTableTableProps> = props => {
  const { nounIds } = props;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds);
  const paddedNounIds = shuffledNounIds
    .map((nounId: string) => {
      return <StandaloneBigNounCircular nounId={EthersBN.from(nounId)} />;
    })
    .concat(Array(NOUNS_PER_VOTE_CARD_DESKTOP).fill(<GrayCircle />))
    .slice(0, NOUNS_PER_VOTE_CARD_DESKTOP);

  const content = () => {
    const rows = 1;
    const rowLength = isXLScreen ? 30 : 20;

    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <tr>
          {Array(rowLength)
            .fill(0)
            .map((_, j) => (
              <td>{paddedNounIds[i * rowLength + j]}</td>
            ))}
        </tr>
      ));
  };

  return <table className={classes.wrapper}>{content()}</table>;
};

export default NounImageInlineTable;
