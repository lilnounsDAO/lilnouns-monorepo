import {
  BigNounImageData as bigNounData,
  ImageData as data,
  getBigNounData,
  getNounData,
} from '@lilnounsdao/assets';
import { buildSVG } from '@lilnounsdao/sdk';
import { BigNumber, BigNumber as EthersBN } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { isLilNounSeedValid, isBigNounSeedValid } from '../../utils/nounSeedValidation';
import { INounSeed, useBigNounSeed, useNounSeed } from '../../wrappers/nounToken';
import Noun from '../Noun';
import nounClasses from '../Noun/Noun.module.css';

export interface INoun {
  id: string;
  name: string;
  svg: string;
  description: string;
  image: string;
  seed: INounSeed;
  blockNumber?: number;
}

interface StandaloneNounProps {
  nounId: EthersBN;
}
interface StandaloneCircularNounProps {
  nounId: EthersBN;
  border?: boolean;
}

interface StandaloneNounWithSeedProps {
  nounId: EthersBN;
  seed?: INounSeed;
  onLoadSeed?: (seed: INounSeed) => void;
  shouldLinkToProfile: boolean;
  fallbackImage?: string; // Contract-generated SVG image to use when seed is invalid
}

export const getNoun = (
  nounId: string | EthersBN | number,
  seed: INounSeed,
  fallbackImage?: string,
): INoun | null => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Lil Noun ${id} is a member of the Lil Nouns DAO`;

  // Validate seed before attempting to build
  // If seed has traits not in assets, use fallback SVG from contract
  if (!isLilNounSeedValid(seed)) {
    if (fallbackImage) {
      // Extract base64 SVG from data URI if needed
      const svgBase64 = fallbackImage.includes(',') 
        ? fallbackImage.split(',')[1] 
        : fallbackImage;
      
      return {
        id,
        name,
        svg: svgBase64,
        description,
        image: fallbackImage,
        seed,
      };
    }
    return null;
  }

  // Seed is valid, build SVG from assets
  try {
    const { parts, background } = getNounData(seed);
    const svg = buildSVG(parts, data.palette, background);
    const image = `data:image/svg+xml;base64,${btoa(svg)}`;

    return {
      id,
      name,
      svg,
      description,
      image,
      seed,
    };
  } catch (error) {
    // If building fails for any reason, fall back to contract SVG
    console.warn(`Failed to build noun ${id} from seed, using fallback:`, error);
    if (fallbackImage) {
      const svgBase64 = fallbackImage.includes(',') 
        ? fallbackImage.split(',')[1] 
        : fallbackImage;
      
      return {
        id,
        name,
        svg: svgBase64,
        description,
        image: fallbackImage,
        seed,
      };
    }
    return null;
  }
};

export const getBigNoun = (
  nounId: string | EthersBN | number,
  seed: INounSeed,
  fallbackImage?: string,
): INoun | null => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Noun ${id} is a member of the Nouns DAO`;

  // Validate seed before attempting to build
  if (!isBigNounSeedValid(seed)) {
    if (fallbackImage) {
      const svgBase64 = fallbackImage.includes(',') 
        ? fallbackImage.split(',')[1] 
        : fallbackImage;
      
      return {
        id,
        name,
        svg: svgBase64,
        description,
        image: fallbackImage,
        seed,
      };
    }
    return null;
  }

  // Seed is valid, build SVG from assets
  try {
    const { parts, background } = getBigNounData(seed);
    const svg = buildSVG(parts, bigNounData.palette, background);
    const image = `data:image/svg+xml;base64,${btoa(svg)}`;

    return {
      id,
      name,
      svg,
      description,
      image,
      seed,
    };
  } catch (error) {
    // If building fails, fall back to contract SVG if available
    console.warn(`Failed to build big noun ${id} from seed:`, error);
    if (fallbackImage) {
      const svgBase64 = fallbackImage.includes(',') 
        ? fallbackImage.split(',')[1] 
        : fallbackImage;
      
      return {
        id,
        name,
        svg: svgBase64,
        description,
        image: fallbackImage,
        seed,
      };
    }
    return null;
  }
};

export const useNounData = (nounId: string | EthersBN | number) => {
  const seed = useNounSeed(BigNumber.from(nounId));
  return useMemo(() => (seed ? getNoun(nounId, seed) : null), [nounId, seed]);
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed ? getNoun(nounId, seed) : null;

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link to={'/lilnoun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Lil Noun'} />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<
  StandaloneCircularNounProps & { styleOverride?: string }
> = (props: StandaloneCircularNounProps & { styleOverride?: string }) => {
  const { nounId, border, styleOverride } = props;
  const seed = useNounSeed(nounId);
  const noun = seed ? getNoun(nounId, seed) : null;

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link to={'/lilnoun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
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
  const noun = seed ? getNoun(nounId, seed) : null;

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link to={'/lilnoun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
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
  const { nounId, onLoadSeed, shouldLinkToProfile, fallbackImage } = props;

  const dispatch = useDispatch();
  const seed = useNounSeed(nounId, props.seed);

  useEffect(() => {
    if (!seed || !onLoadSeed) return;
    onLoadSeed(seed);
  }, [seed, onLoadSeed]);

  const noun = useMemo(() => {
    if (!seed) return undefined;
    return getNoun(nounId, seed, fallbackImage) || undefined;
  }, [seed, nounId, fallbackImage]);

  if (!noun) return <Noun imgPath={fallbackImage || ''} alt="Lil Noun" />;

  // Only pass seed to Noun component if it's valid (to avoid errors in NounTraitsOverlay)
  const nounComponent = (
    <Noun
      imgPath={noun.image}
      alt={noun.description}
      seed={seed && isLilNounSeedValid(seed) ? seed : undefined}
    />
  );
  const nounWithLink = (
    <Link
      to={'/lilnoun/' + nounId.toString()}
      className="cursor-pointer"
      onClick={() => {
        dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
      }}
    >
      {nounComponent}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : nounComponent;
};

export const StandaloneBigNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps,
) => {
  const { nounId } = props;
  const seed = useBigNounSeed(nounId);
  const noun = seed ? getBigNoun(nounId, seed) : null;

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
