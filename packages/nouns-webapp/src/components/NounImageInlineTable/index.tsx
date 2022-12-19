import { StandaloneBigNounCircular } from '../StandaloneNoun';
import { BigNumber as EthersBN } from 'ethers';
import classes from './NounImageInlineTable.module.css';
import { pseudoRandomPredictableShuffle } from '../../utils/pseudoRandomPredictableShuffle';
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from 'react';

interface NounImageInlineTableTableProps {
  nounIds: string[];
}

const isXLScreen = window.innerWidth > 1200;

const NounImageInlineTable: React.FC<NounImageInlineTableTableProps> = props => {
  const { nounIds } = props;

  const [width, setWidth] = useState(0);
  const carousel = useRef(null);;

  const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds);
  const paddedNounIds = shuffledNounIds
    .map((nounId: string) => {
      return <motion.div className={classes.item}>
        <StandaloneBigNounCircular nounId={EthersBN.from(nounId)} />
      </motion.div>
    })

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


  useEffect(() => {
    const node = carousel.current as any
    setWidth(node.scrollWidth - node.offsetWidth)
  }, [])

  return (
    <motion.div ref={carousel} className={classes.carousel}>
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className={classes.innerCarousel}>
        {content()}
      </motion.div>
    </motion.div>
  )

};

export default NounImageInlineTable;
