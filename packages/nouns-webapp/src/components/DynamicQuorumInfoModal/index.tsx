import { useQuery } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { Proposal } from '../../wrappers/nounsDao';
import { useDynamicQuorumProps } from '../../wrappers/nounsDao';
import { totalNounSupplyAtPropSnapshot } from '../../wrappers/subgraph';
import { Backdrop } from '../Modal';
import classes from './DynamicQuorumInfoModal.module.css';
import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import config from '../../config';
import { useBigNounDynamicQuorumProps } from '../../wrappers/bigNounsDao';

const PLOTTING_CONSTANTS = {
  width: 950,
  dqFunctionMaxQXCrossoverPlotSpace: 470,
  height: 320,
  minQHeightPlotSpace: 288,
  maxQHeightPlotSpace: 32,
  slopeDQFunctionPlotSpace: -0.54468085106,
  mobileScreenCutoffWidthPixels: 1200,
};

const DynamicQuorumInfoModalOverlay: React.FC<{
  proposal: Proposal;
  isNounsDAOProp: boolean;
  againstVotesBps: number;
  againstVotesAbs: number;
  minQuorumBps: number;
  maxQuorumBps: number;
  quorumCoefficent: number;
  totalNounSupply: number;
  onDismiss: () => void;
}> = props => {
  const {
    onDismiss,
    proposal,
    isNounsDAOProp,
    againstVotesAbs,
    againstVotesBps,
    quorumCoefficent,
    minQuorumBps,
    maxQuorumBps,
    totalNounSupply,
  } = props;

  const linearToConstantCrossoverBPS = (maxQuorumBps - minQuorumBps) / quorumCoefficent;

  const dqmFunction = (bps: number) => {
    return Math.min(minQuorumBps + quorumCoefficent * bps, maxQuorumBps);
  };

  const plotSpaceFunction = (x: number) => {
    return PLOTTING_CONSTANTS.slopeDQFunctionPlotSpace * x + PLOTTING_CONSTANTS.minQHeightPlotSpace;
  };

  const calcPlotFrac = () => {
    if (Math.floor((linearToConstantCrossoverBPS * totalNounSupply) / 10_000) <= 0) {
      return 0;
    }
    return (
      (againstVotesAbs / Math.floor((linearToConstantCrossoverBPS * totalNounSupply) / 10_000)) *
      PLOTTING_CONSTANTS.dqFunctionMaxQXCrossoverPlotSpace
    );
  };

  const x =
    againstVotesBps < linearToConstantCrossoverBPS
      ? calcPlotFrac()
      : PLOTTING_CONSTANTS.dqFunctionMaxQXCrossoverPlotSpace +
        0.5 * PLOTTING_CONSTANTS.width * (againstVotesBps / 10_000);
  const y = Math.max(plotSpaceFunction(x), PLOTTING_CONSTANTS.maxQHeightPlotSpace);

  const token = isNounsDAOProp ? 'Noun' : 'Lil Noun';
  const tokens = isNounsDAOProp ? 'Nouns' : 'Lil Nouns';

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>
      <div className={classes.modal}>
        <div className={classes.content}>
          <h1 className={classes.title}>
            <a>Dynamic Threshold</a>
          </h1>

          <p className={classes.mainCopy}>
            {window.innerWidth < 1200 ? (
              <a>
                The Threshold (minimum number of For votes required to pass a proposal) is set as a
                function of the number of Against votes a proposal has received. It increases
                quadratically as a function of the % of {token} voting against a prop, varying
                between Min Threshold and Max Threshold.
              </a>
            ) : (
              <a>
                The Threshold (minimum number of For votes required to pass a proposal) is set as a
                function of the number of Against votes a proposal has received. The number of For
                votes required to pass Proposal {proposal.id} is given by the following curve:
              </a>
            )}
          </p>

          {/* Mobile - no graph content */}
          <div className={clsx(responsiveUiUtilsClasses.mobileOnly, classes.mobileQuorumWrapper)}>
            <div className={classes.mobileQuorumInfo}>
              <span>Min Threshold:</span>
              {Math.floor((minQuorumBps * totalNounSupply) / 10_000)} {tokens}
            </div>

            <div className={classes.mobileQuorumInfo}>
              <span>Current Threshold:</span>
              {Math.floor(
                (Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) * totalNounSupply) / 10_000,
              )}{' '}
              {tokens}
            </div>

            <div className={classes.mobileQuorumInfo}>
              <span>Max Threshold:</span>
              {Math.floor((maxQuorumBps * totalNounSupply) / 10_000)} {tokens}
            </div>
          </div>

          {/* Outter container */}
          <div className={clsx(classes.graphContainer, classes.outterGraphContainer)}>
            <div className={classes.graphWrapper}>
              {/* Y-Axis label */}
              <div className={classes.yAxisText}>
                <a>Required % of {tokens} to Pass</a>
              </div>

              {/* Inner graph container */}
              <div className={clsx(classes.graphContainer, classes.innerGraphContainer)}>
                {/* <svg width="950" height="320"> */}
                <svg width={PLOTTING_CONSTANTS.width} height={PLOTTING_CONSTANTS.height}>
                  <line
                    x1="0"
                    y1={PLOTTING_CONSTANTS.minQHeightPlotSpace}
                    x2="100%"
                    y2={PLOTTING_CONSTANTS.minQHeightPlotSpace}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <line
                    x1="0"
                    y1={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    x2="100%"
                    y2={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <line
                    x1={470}
                    y1={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    x2={470}
                    y2={PLOTTING_CONSTANTS.height}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <g fill="#4965F080" stroke="none">
                    <polygon points={`950,288 950,32 470,32 0,288`} />
                    <polygon points={`950,320 950,288 ${0},288 0,320`} />
                  </g>
                  {Math.abs(x - 470) > 100 && (
                    <text
                      fill="var(--brand-gray-light-text)"
                      x={470 + 10}
                      y={PLOTTING_CONSTANTS.height - 10}
                    >
                      {linearToConstantCrossoverBPS / 100}% of {tokens} Against
                    </text>
                  )}
                  {/* Vertical Line indicating against BPS */}
                  <line
                    x1={x}
                    y1={PLOTTING_CONSTANTS.height}
                    y2={y}
                    x2={x}
                    stroke="var(--brand-color-red)"
                    stroke-width="4"
                  />
                  {/* Horizontal Line Indicating Required For BPS */}
                  <line
                    x1={0}
                    y1={y}
                    y2={y}
                    x2={x}
                    stroke="var(--brand-color-green)"
                    stroke-width="4"
                  />
                  <circle cy={y} cx={x} r="7" fill="var(--brand-gray-light-text)" />
                  <text x="20" y="24">
                    Max Threshold: {Math.floor((maxQuorumBps * totalNounSupply) / 10_000)} {tokens}{' '}
                    <tspan fill="var(--brand-gray-light-text)">
                      ({maxQuorumBps / 100}% of {tokens})
                    </tspan>
                  </text>
                  {Math.abs(y - 10 - PLOTTING_CONSTANTS.minQHeightPlotSpace) > 100 ? (
                    <>
                      <text x="20" y="280">
                        Min Threshold: {Math.floor((minQuorumBps * totalNounSupply) / 10_000)}{' '}
                        {Math.floor((minQuorumBps * totalNounSupply) / 10_000) === 1
                          ? `${token}`
                          : `${tokens}`}{' '}
                        <tspan fill="var(--brand-gray-light-text)">
                          ({minQuorumBps / 100}% of {tokens})
                        </tspan>
                      </text>
                    </>
                  ) : (
                    <>
                      <text x="550" y="280">
                        Min Threshold: {Math.floor((minQuorumBps * totalNounSupply) / 10_000)} {tokens}{' '}
                        <tspan fill="var(--brand-gray-light-text)">
                          ({minQuorumBps / 100}% of {tokens})
                        </tspan>
                      </text>
                    </>
                  )}
                  {againstVotesBps >= 400 && againstVotesAbs >= maxQuorumBps && (
                    <text x={10} y={y - 10} fill="var(--brand-gray-light-text)">
                      {Math.floor(Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) / 100)}% of
                      {tokens}
                    </text>
                  )}
                  {againstVotesBps > 4000 ? (
                    <text
                      x={x - 390}
                      y={y + (againstVotesBps > 0.9 * linearToConstantCrossoverBPS ? 20 : -10)}
                    >
                      Current Threshold:{' '}
                      {Math.floor(
                        (Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) * totalNounSupply) /
                          10_000,
                      )}{' '}
                      <tspan fill="var(--brand-gray-light-text)">
                        ({againstVotesAbs} {againstVotesAbs === 1 ? `${token}` : `${tokens}`}{' '}
                        Currently Against)
                      </tspan>
                    </text>
                  ) : (
                    <text
                      x={x + 10}
                      y={y + (againstVotesBps > 0.9 * linearToConstantCrossoverBPS ? 20 : -10)}
                    >
                      Current Threshold:{' '}
                      {Math.floor(
                        (Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) * totalNounSupply) /
                          10_000,
                      )}{' '}
                      <tspan fill="var(--brand-gray-light-text)">
                        ({againstVotesAbs} {againstVotesAbs === 1 ? `${token}` : `${tokens}`}{' '}
                        Currently Against)
                      </tspan>
                    </text>
                  )}
                  {againstVotesAbs > 0 && (
                    <text x={x + (x < 712 ? 10 : -110)} y={310} fill="var(--brand-gray-light-text)">
                      {Math.floor(againstVotesBps / 100)}% of {tokens}
                    </text>
                  )}
                  {againstVotesBps >= 0.1 * maxQuorumBps && (
                    <text x={4} y={310} fill="var(--brand-gray-light-text)">
                      0%
                    </text>
                  )}
                  Sorry, your browser does not support inline SVG.
                </svg>
              </div>
            </div>

            <div className={classes.xAxisText}>
              <a>% of {tokens} Currently Against</a>
            </div>
          </div>

          {/* <p className={classes.moreDetailsCopy}>
            <a>
              More details on how dynamic quorum works can be found{' '}
              <span className={classes.underline}>here</span>.
            </a>
          </p> */}
        </div>
      </div>
    </>
  );
};

const DynamicQuorumInfoModal: React.FC<{
  proposal: Proposal;
  isNounsDAOProp: boolean;
  againstVotesAbsolute: number;
  onDismiss: () => void;
}> = props => {
  const { onDismiss, proposal, isNounsDAOProp, againstVotesAbsolute } = props;
  const nounsProxyAddress = isNounsDAOProp
    ? config.bigNounsAddresses.nounsDAOProxy
    : config.addresses.nounsDAOProxy;
  const { data, loading, error } = useQuery(
    totalNounSupplyAtPropSnapshot(proposal && proposal.id ? proposal.id : '0'),
    {
      context: { clientName: isNounsDAOProp ? 'NounsDAO' : 'LilNounsDAO' },
    },
  );

  const dynamicQuorumProps = isNounsDAOProp
    ? useBigNounDynamicQuorumProps(nounsProxyAddress, proposal.startBlock)
    : useDynamicQuorumProps(nounsProxyAddress, proposal.startBlock);

  if (error) {
    console.log(`proposalproposal=${proposal}`);
    return <>Failed to fetch dynamic threshold info</>;
  }

  if (loading) {
    return <></>;
  }

  // coeffient is represented as fixed point number multiplied by 1e6, thus we need to divide by this number to rescale it
  const scalingFactor = 1_000_000;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DynamicQuorumInfoModalOverlay
          againstVotesBps={Math.floor(
            (againstVotesAbsolute / data.proposals[0].totalSupply) * 10_000,
          )}
          againstVotesAbs={againstVotesAbsolute}
          minQuorumBps={dynamicQuorumProps?.minQuorumVotesBPS ?? 0}
          maxQuorumBps={dynamicQuorumProps?.maxQuorumVotesBPS ?? 0}
          quorumCoefficent={
            dynamicQuorumProps?.quorumCoefficient
              ? dynamicQuorumProps?.quorumCoefficient / scalingFactor
              : 0
          }
          onDismiss={onDismiss}
          proposal={proposal}
          isNounsDAOProp={isNounsDAOProp}
          totalNounSupply={data.proposals[0].totalSupply}
        />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;
