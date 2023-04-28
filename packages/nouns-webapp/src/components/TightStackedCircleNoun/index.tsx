import { useBigNounSeed, useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { getBigNoun, getNoun } from '../StandaloneNoun';
import { LoadingNoun } from '../Noun';

interface TightStackedCircleNounProps {
  nounId: number;
  index: number;
  square: number;
  shift: number;
  isNounsDAOProp?: boolean;
}

const TightStackedCircleNoun: React.FC<TightStackedCircleNounProps> = props => {
  const { nounId, index, square, shift, isNounsDAOProp } = props;

  const seed = isNounsDAOProp ? useBigNounSeed(BigNumber.from(nounId)) : useNounSeed(BigNumber.from(nounId));

  if (!seed) {
    return <LoadingNoun />;
  }

  const nounData = isNounsDAOProp ? getBigNoun(BigNumber.from(nounId), seed): getNoun(BigNumber.from(nounId), seed);
  const image = nounData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleNoun${nounId}`}>
        <circle
          id={`${nounId}`}
          r="20"
          cx={28 + index * shift}
          cy={square - 21 - index * shift}
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: '2',
          }}
        />
      </clipPath>

      <use xlinkHref={`#${nounId}`} />
      <image
        clipPath={`url(#clipCircleNoun${nounId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export const TightStackedCircleNounCell: React.FC<TightStackedCircleNounProps> = props => {
  const { nounId, index, square, shift, isNounsDAOProp } = props;

  const seed = isNounsDAOProp ? useBigNounSeed(BigNumber.from(nounId)) : useNounSeed(BigNumber.from(nounId));

  if (!seed) {
    return <LoadingNoun />;
  }

  const nounData = isNounsDAOProp ? getBigNoun(BigNumber.from(nounId), seed): getNoun(BigNumber.from(nounId), seed);
  const image = nounData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleNoun${nounId}`}>
        <circle
          id={`${nounId}`}
          r="20"
          cx={21 + index * shift}
          cy={square - 21 - index * shift}
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: '2',
          }}
        />
      </clipPath>

      <use xlinkHref={`#${nounId}`} />
      <image
        clipPath={`url(#clipCircleNoun${nounId})`}
        x={1 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleNoun;
