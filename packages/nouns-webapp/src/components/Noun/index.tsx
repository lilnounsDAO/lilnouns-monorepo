import React from 'react';
import Image from 'react-bootstrap/Image';
import loadingNoun from '../../assets/lil-loading-skull.gif';
import loadingBigNoun from '../../assets/loading-skull-noun.gif';
import { INounSeed } from '../../wrappers/nounToken';
import NounTraitsOverlay from '../NounTraitsOverlay';
import classes from './Noun.module.css';

export const LoadingNoun = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingNoun} alt={'loading noun'} fluid />
    </div>
  );
};

const Noun: React.FC<{
  imgPath: string;
  isBigNoun?: boolean;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  seed?: INounSeed;
}> = props => {
  const { imgPath, alt, className, wrapperClassName, seed, isBigNoun } = props;
  return (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`} data-tip data-for="noun-traits">
      <Image
        className={`${classes.img} ${className}`}
        src={imgPath ? imgPath : isBigNoun ? loadingBigNoun : loadingNoun}
        alt={alt}
        fluid
      />
      {seed && <NounTraitsOverlay seed={seed} />}
    </div>
  );
};

export default Noun;
