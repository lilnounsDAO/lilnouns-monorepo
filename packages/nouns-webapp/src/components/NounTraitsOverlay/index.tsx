import classes from './NounTraitsOverlay.module.css';
import React from 'react';
import ReactTooltip from 'react-tooltip';

const NounTraitsOverlay: React.FC<{
  parts: { filename: string }[];
}> = props => {
  const { parts } = props;
  const getNounTrait = (part: { filename: string }) => {
    const splitData: string[] = part.filename.split('-');
    return {trait: splitData[0], value: splitData.slice(1).join(' ')}
  }

  return (
    <ReactTooltip
      id="noun-traits"
      place="top"
      effect="float"
      backgroundColor="white"
      textColor="black"
    >
      <ul className={classes.traitList}>
        {parts.map((part) => {
          const { trait, value } = getNounTrait(part);
          return (
            <li key={trait}>
              {trait}: {value}
            </li>
          )
        })}
      </ul>
    </ReactTooltip>
  );
};

export default NounTraitsOverlay;