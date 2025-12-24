import { ImageData, BigNounImageData } from '@lilnounsdao/assets';
import { INounSeed } from '../wrappers/nounToken';

const { images, bgcolors } = ImageData;
const { images: bigNounImages, bgcolors: bigNounBgcolors } = BigNounImageData;

const { bodies, accessories, heads, glasses } = images;

/**
 * Validate if a lil noun seed has all trait indices within bounds
 * This prevents errors when trying to build nouns with new traits not yet in assets
 * @param seed The Noun seed to validate
 */
export const isLilNounSeedValid = (seed: INounSeed): boolean => {
  try {
    return (
      seed.background >= 0 &&
      seed.background < bgcolors.length &&
      seed.body >= 0 &&
      seed.body < bodies.length &&
      seed.accessory >= 0 &&
      seed.accessory < accessories.length &&
      seed.head >= 0 &&
      seed.head < heads.length &&
      seed.glasses >= 0 &&
      seed.glasses < glasses.length &&
      // Double-check that parts actually exist
      bodies[seed.body] !== undefined &&
      accessories[seed.accessory] !== undefined &&
      heads[seed.head] !== undefined &&
      glasses[seed.glasses] !== undefined &&
      bgcolors[seed.background] !== undefined
    );
  } catch {
    return false;
  }
};

/**
 * Validate if a big noun seed has all trait indices within bounds
 * @param seed The Noun seed to validate
 */
export const isBigNounSeedValid = (seed: INounSeed): boolean => {
  try {
    return (
      seed.background >= 0 &&
      seed.background < bigNounBgcolors.length &&
      seed.body >= 0 &&
      seed.body < bigNounImages.bodies.length &&
      seed.accessory >= 0 &&
      seed.accessory < bigNounImages.accessories.length &&
      seed.head >= 0 &&
      seed.head < bigNounImages.heads.length &&
      seed.glasses >= 0 &&
      seed.glasses < bigNounImages.glasses.length &&
      // Double-check that parts actually exist
      bigNounImages.bodies[seed.body] !== undefined &&
      bigNounImages.accessories[seed.accessory] !== undefined &&
      bigNounImages.heads[seed.head] !== undefined &&
      bigNounImages.glasses[seed.glasses] !== undefined &&
      bigNounBgcolors[seed.background] !== undefined
    );
  } catch {
    return false;
  }
};

