import { StandaloneBigNounCircular } from '../StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounImageInlineTable.module.css';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

interface NounImageInlineTableTableProps {
  nounIds: string[];
}

const isXLScreen = window.innerWidth > 1200;

const scroll = (nounCount: number) => {
  return keyframes`
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-42px * (1.12 * ${nounCount})))}
    }`;
};

interface CarouselProps {
  nounCount: number;
}

const InnerCarousel = styled.div<CarouselProps>`
  display: flex;
  animation: ${prop => scroll(prop.nounCount)} 10s linear infinite;

  :hover {
    animation-play-state: paused;
  }
`;

const NounImageInlineTable: React.FC<NounImageInlineTableTableProps> = props => {
  const { nounIds } = props;
  const carousel = useRef(null);

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds);
  const paddedNounIds = shuffledNounIds.map((nounId: string) => {
    return (
      <div className={classes.item}>
        <StandaloneBigNounCircular nounId={EthersBN.from(nounId)} />
      </div>
    );
  });

  const content = () => {
    const rows = 1;
    const rowLength = isXLScreen ? 30 : 20;

    return Array(rows)
      .fill(0)
      .map((_, i) => (
            <tr key={i}>
              {Array(rowLength)
                .fill(0)
                .map((_, j) => (
                  <td>{paddedNounIds[i * rowLength + j]}</td>
                ))}
            </tr>
      ));
  };

  return (
    <div ref={carousel} className={classes.carousel}>
      <InnerCarousel nounCount={nounIds.length}>
        {content()}
        {content()}
      </InnerCarousel>
    </div>
  );
};

export default NounImageInlineTable;
