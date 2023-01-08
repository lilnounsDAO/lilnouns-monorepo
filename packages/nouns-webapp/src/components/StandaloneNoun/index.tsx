import {
  ImageData as data,
  getNounData,
  getBigNounData,
  BigNounImageData as bigNounData,
} from '@lilnounsdao/assets';
import { buildSVG } from '@lilnounsdao/sdk';
import { BigNumber, BigNumber as EthersBN } from 'ethers';
import { INounSeed, useBigNounSeed, useNounSeed } from '../../wrappers/nounToken';
import Noun from '../Noun';
import { Link } from 'react-router-dom';
import classes from './StandaloneNoun.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import nounClasses from '../Noun/Noun.module.css';
import { useMemo } from 'react';

interface StandaloneNounProps {
  nounId: EthersBN;
}
interface StandaloneCircularNounProps {
  nounId: EthersBN;
  border?: boolean;
}

interface StandaloneNounWithSeedProps {
  nounId: EthersBN;
  onLoadSeed?: (seed: INounSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getNoun = (nounId: string | EthersBN | number, seed: INounSeed) => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Lil Noun ${id} is a member of the Lil Nouns DAO`;
  const { parts, background } = getNounData(seed);
  const svg = buildSVG(parts, data.palette, background);
  const image = `data:image/svg+xml;base64,${btoa(svg)}`;

  return {
    name,
    svg,
    description,
    image,
    parts,
  };
};

export const getBigNoun = (nounId: string | EthersBN | number, seed: INounSeed) => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Noun ${id} is a member of the Nouns DAO`;
  const { parts, background } = getBigNounData(seed);
  const svg = buildSVG(parts, bigNounData.palette, background);
  const image = `data:image/svg+xml;base64,${btoa(svg)}`;

  return {
    name,
    svg,
    description,
    image,
    parts,
  };
};

export const useNounData = (nounId: string | EthersBN | number) => {
  const seed = useNounSeed(BigNumber.from(nounId));
  return useMemo(() => seed && getNoun(nounId, seed), [nounId, seed]);
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/lilnoun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Lil Noun'} />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<
  StandaloneCircularNounProps & { styleOverride?: string }
> = (props: StandaloneCircularNounProps & { styleOverride?: string }) => {
  const { nounId, border, styleOverride } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/lilnoun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Lil Noun'}
        wrapperClassName={`${nounClasses.circularNounWrapper} ${styleOverride || ''}`}
        className={border ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounRoundedCorners: React.FC<StandaloneNounProps> = (
  props: StandaloneNounProps,
) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/lilnoun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Lil Noun'}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = (
  props: StandaloneNounWithSeedProps,
) => {
  const { nounId, onLoadSeed, shouldLinkToProfile } = props;

  const dispatch = useDispatch();
  const seed = useNounSeed(nounId);

  if (!seed || !nounId || !onLoadSeed) return <Noun imgPath="" alt="Lil Noun" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  const { image, description, parts } = getNoun(nounId, seed);

  const noun = <Noun imgPath={image} alt={description} parts={parts} />;
  const nounWithLink = (
    <Link
      to={'/lilnoun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export const StandaloneBigNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps,
) => {
  const { nounId } = props;
  const seed = useBigNounSeed(nounId);
  const noun = seed && getBigNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <a target="_blank" href={'https://nouns.wtf/noun/' + nounId.toString()}>
      <Noun
        isBigNoun={true}
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={nounClasses.circular}
      />
    </a>
  );
};

export default StandaloneNoun;
