import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';

import NounImageInllineTable from '../../components/NounImageInllineTable';
import { isMobileScreen } from '../../utils/isMobile';
import config from '../../config';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Lil Noun' : 'Lil Nouns'}`;

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  const isMobile = isMobileScreen();

  const [bigNounBalance, setBigNounBalance] = useState('0');
  const [bigNounIds, setBigNounIds] = useState([]);

  const fetchNounsQuery = `
  query {
      accounts(where: {id: "0xd5f279ff9eb21c6d40c8f345a66f2751c4eea1fb" }) {
      id
      tokenBalance
      nouns {
        id
      }
    }
  }
    `;

  async function fetchData() {
    const repsonse = await createClient({ url: config.app.nounsDAOSubgraphApiUri })
      .query(fetchNounsQuery)
      .toPromise();
    return repsonse.data.accounts[0];
  }

  useEffect(() => {
    fetchData()
      .then(async repsonse => {
        const tokenBalance = repsonse.tokenBalance;
        const nounIds = repsonse.nouns.flatMap((obj: { id: any }) => obj.id);

        setBigNounBalance(tokenBalance);
        setBigNounIds(nounIds);
        return;
      })
      .catch(error => {
        console.log(`Nouns Owned Error ${error}`);
        return;
      });
  }, []);

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Governance</span>
          <h1>Lil Nouns DAO</h1>
        </Row>
        <p className={classes.subheading}>
          Lil Nouns govern <span className={classes.boldText}>Lil Nouns DAO</span>. Lil Nouns can
          vote on proposals or delegate their vote to a third party. A minimum of{' '}
          <span className={classes.boldText}>{nounThresholdCopy}</span> is required to submit
          proposals.{' '} A minimum of <span className={classes.boldText}>{"1 Lil Noun"}</span> is required to vote.
        </p>

        <Row className={classes.treasuryInfoCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>Treasury</span>
            </Row>
            <Row>
              <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                <h1 className={classes.ethSymbol}>Ξ</h1>
                <h1>
                  {treasuryBalance &&
                    Number(Number(utils.formatEther(treasuryBalance)).toFixed(0)).toLocaleString(
                      'en-US',
                    )}
                </h1>
              </Col>
              <Col className={classes.usdTreasuryAmt}>
                <h1 className={classes.usdBalance}>
                  ${' '}
                  {treasuryBalanceUSD &&
                    Number(treasuryBalanceUSD.toFixed(0)).toLocaleString('en-US')}
                </h1>
              </Col>
            </Row>
            <Row>
              <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                <h1 className={classes.BigNounBalance}>{bigNounBalance}</h1>
                <h1>{' Nouns'}</h1>
              </Col>

              {!isMobile && (
                <Col className={classes.usdTreasuryAmt}>
                  <Row className={classes.nounProfilePics}>
                    <NounImageInllineTable nounIds={bigNounIds} />
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
          <Col className={classes.treasuryInfoText}>
            This treasury exists for <span className={classes.boldText}>Lil Nouns DAO</span>{' '}
            participants to allocate resources for the long-term growth and prosperity of the Lil
            Nouns project.
          </Col>
        </Row>
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
