import { getNounData } from '@lilnounsdao/assets';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { INounSeed } from '../../wrappers/nounToken';
import classes from './NounTraitsOverlay.module.css';

const NounTraitsOverlay: React.FC<{ seed: INounSeed }> = props => {
  const { seed } = props;

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
        {parts.map(part => {
          const { trait, value } = getNounTrait(part);
          return (
            <li key={trait}>
              {trait}: {value}
            </li>
          );
        })}
      </ul>
    </ReactTooltip>
  );
};

export default NounTraitsOverlay;
