import classes from './Noun.module.css';
import React from 'react';
import loadingNoun from '../../assets/lil-loading-skull.gif';
import Image from 'react-bootstrap/Image';
import NounTraitsOverlay from '../NounTraitsOverlay';

export const LoadingNoun = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingNoun} alt={'loading noun'} fluid />
    </div>
  );
};

const Noun: React.FC<{
  imgPath: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  parts?: { filename: string }[];
}> = props => {
  const { imgPath, alt, className, wrapperClassName, parts } = props;
  return (
      <div className={`${classes.imgWrapper} ${wrapperClassName}`} data-tip data-for="noun-traits">
      <Image
        className={`${classes.img} ${className}`}
        src={imgPath ? imgPath : loadingNoun}
        alt={alt}
        fluid
      />
      {Boolean(parts?.length) && <NounTraitsOverlay parts={parts!} />}
    </div>
  );
};

export default Noun;
