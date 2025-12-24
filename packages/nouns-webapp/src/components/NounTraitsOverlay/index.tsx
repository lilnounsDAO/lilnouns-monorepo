import { getNounData } from '@lilnounsdao/assets';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { isLilNounSeedValid } from '../../utils/nounSeedValidation';
import { INounSeed } from '../../wrappers/nounToken';
import classes from './NounTraitsOverlay.module.css';

const NounTraitsOverlay: React.FC<{ seed: INounSeed }> = props => {
  const { seed } = props;

  // If seed is invalid (has traits not in assets), don't render traits
  if (!isLilNounSeedValid(seed)) {
    return null;
  }

  const { parts } = getNounData(seed);

  const getNounTrait = (part: { filename: string }) => {
    const splitData: string[] = part.filename.split('-');
    return { trait: splitData[0], value: splitData.slice(1).join(' ') };
  };

  return (
    <ReactTooltip
      id="noun-traits"
      place="top"
      effect="float"
      backgroundColor="white"
      textColor="black"
    >
      <ul className={classes.traitList}>
        {parts.map((part, index) => {
          const { trait, value } = getNounTrait(part);
          return (
            <li key={`${trait}-${index}-${part.filename}`}>
              {trait}: {value}
            </li>
          );
        })}
      </ul>
    </ReactTooltip>
  );
};

export default NounTraitsOverlay;
