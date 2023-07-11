import React, { useCallback, useMemo } from 'react';
import { Col } from 'react-bootstrap';

import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';
import _DownloadIcon from '../../assets/icons/Download.svg';

import NounInfoRowBirthday from '../NounInfoRowBirthday';
import NounInfoRowHolder from '../NounInfoRowHolder';
import NounInfoRowButton from '../NounInfoRowButton';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { useNounData } from '../StandaloneNoun';
import { svg2png } from '../../utils/svg2png';
import { buildEtherscanTokenLink } from '../../utils/etherscan';

interface NounInfoCardProps {
  nounId: number;
  bidHistoryOnClickHandler: () => void;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {
  const { nounId, bidHistoryOnClickHandler } = props;

  const etherscanButtonClickHandler = () =>
  window.open(buildEtherscanTokenLink(config.addresses.nounsToken, nounId));

  const noun = useNounData(nounId);

  const etherscanBaseURL = useMemo(
    () => buildEtherscanAddressLink(config.addresses.nounsToken),
    [config.addresses.nounsToken],
  );

  const downloadPngClicked = useCallback(async () => {
    if (!noun) {
      return;
    }

    // console.log(noun);
    const png = await svg2png(noun.svg, 500, 500)
    if (!png) {
      return;
    }

    const downloadEl = document.createElement('a');
    downloadEl.href = png;
    downloadEl.download = `lilnoun-${nounId}.png`;
    downloadEl.click();
  }, [noun, nounId]);

  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  return (
    <>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowBirthday nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowHolder nounId={nounId} />
      </Col>
      <Col lg={12} className={classes.nounInfoRow}>
        <NounInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={lastAuctionNounId === nounId ? 'Bids' : 'Bid history'}
          onClickHandler={bidHistoryOnClickHandler}
        />
        <NounInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={'Etherscan'}
          onClickHandler={etherscanButtonClickHandler}
        />
        <div style={{opacity: noun ? '1' : '0.4'}}>
          <NounInfoRowButton
            iconImgSource={_DownloadIcon}
            btnText="Download PNG"
            onClickHandler={downloadPngClicked}
          />
        </div>
      </Col>
    </>
  );
};

export default NounInfoCard;
