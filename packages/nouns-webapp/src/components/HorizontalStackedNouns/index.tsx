import { BigNumber } from 'ethers';
import React from 'react';
import { StandaloneBigNounCircular, StandaloneNounCircular } from '../StandaloneNoun';
import classes from './HorizontalStackedNouns.module.css';

interface HorizontalStackedNounsProps {
  nounIds: string[];
  isNounsDAOProp?: boolean;
}

const HorizontalStackedNouns: React.FC<HorizontalStackedNounsProps> = props => {
  const { nounIds, isNounsDAOProp } = props;
  return (
    <div className={classes.wrapper}>
      {nounIds
        .slice(0, 6)
        .map((nounId: string, i: number) => {
          return (
            <div
              key={nounId.toString()}
              style={{
                top: '0px',
                left: `${25 * i}px`,
              }}
              className={classes.nounWrapper}
            >
              {isNounsDAOProp ? (
                <StandaloneBigNounCircular nounId={BigNumber.from(nounId)} border={true} />
              ) : (
                <StandaloneNounCircular nounId={BigNumber.from(nounId)} border={true} />
              )}
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default HorizontalStackedNouns;
