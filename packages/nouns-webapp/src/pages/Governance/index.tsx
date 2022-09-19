import { Button, Col, Row, Spinner } from 'react-bootstrap';
import Section from '../../layout/Section';
import { Proposal, useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import { useAllBigNounProposals } from '../../wrappers/bigNounsDao';
import Proposals, { SnapshotProposal } from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';

import NounImageInllineTable from '../../components/NounImageInlineTable';
import { isMobileScreen } from '../../utils/isMobile';
import { useEffect, useState } from 'react';

import { snapshotProposalsQuery, nounsInTreasuryQuery } from '../../wrappers/subgraph';
import { useQuery } from '@apollo/client';
import Link from '../../components/Link';
import { RouteComponentProps } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

const GovernancePage = ({
  match: {
    params: { id }
  },
}: RouteComponentProps<{ id: string }>) => {
  const { data: proposals, loading: loadingProposals } = useAllProposals();
  const { data: bigNounProposals, loading: loadingBigNounProposals } = useAllBigNounProposals();

  const {
    loading: nounsInTreasuryLoading,
    error: nounsInTreasuryError,
    data: nounsInTreasury,
  } = useQuery(nounsInTreasuryQuery(), {
    context: { clientName: 'NounsDAO' },
  });

  const {
    loading: snapshotProposalLoading,
    error: snapshotProposalError,
    data: snapshotProposalData,
  } = useQuery(snapshotProposalsQuery(), {
    context: { clientName: 'NounsDAOSnapshot' },
  });

  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Lil Noun' : 'Lil Nouns'}`;

  const [isNounsDAOProp, setisNounsDAOProp] = useState(false);
  const [snapshotProposals, setSnapshotProposals] = useState(undefined);

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  const [daoButtonActive, setDaoButtonActive] = useState('1');

  const isMobile = isMobileScreen();

  function setLilNounsDAOProps() {
    setDaoButtonActive('1');
    setisNounsDAOProp(false);
    window.history.pushState({}, 'Lil Nouns DAO', '/vote');
  }

  function setNounsDAOProps() {
    setDaoButtonActive('2');
    setisNounsDAOProp(true);
    window.history.pushState({}, 'Lil Nouns DAO', '/vote/nounsdao');
  }

  const location = useLocation();

  useEffect(() => {
    if(!location.pathname) return;

    if (location.pathname == '/vote/nounsdao') {
      setNounsDAOProps();
    }
  }, []);

  const nounsDaoLink = <Link text="Nouns DAO" url="https://nouns.wtf" leavesPage={true} />;
  const snapshotLink = (
    <Link text="Snapshot" url="https://snapshot.org/#/leagueoflils.eth" leavesPage={true} />
  );

  if (
    nounsInTreasuryLoading ||
    snapshotProposalLoading ||
    loadingBigNounProposals ||
    loadingProposals
  ) {
    return (
      <div className={classes.spinner}>
        <Spinner animation="border" />
      </div>
    );
  }

  const nounCount = nounsInTreasury.accounts.length ? nounsInTreasury.accounts[0].tokenBalance : "0"

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Governance</span>
          <div className={classes.headerWrapper}>
            <h1>{!isNounsDAOProp ? 'Lil Nouns DAO' : 'Nouns DAO'}</h1>
            <div className="btn-toolbar" role="btn-toolbar" aria-label="Basic example">
              <Button
                key={1}
                className={
                  daoButtonActive === '1'
                    ? classes.governanceSwitchBtnActive
                    : classes.governanceSwitchBtn
                }
                id={'1'}
                onClick={e => setLilNounsDAOProps()}
              >
                Lil Nouns DAO
              </Button>
              <Button
                key={2}
                className={
                  daoButtonActive === '2'
                    ? classes.governanceSwitchBtn2Active
                    : classes.governanceSwitchBtn2
                }
                onClick={e => setNounsDAOProps()}
              >
                Nouns DAO
              </Button>
            </div>
          </div>
        </Row>

        <>
          <p className={classes.subheading}>
            {!isNounsDAOProp ? (
              <>
                Lil Nouns govern <span className={classes.boldText}>Lil Nouns DAO</span>. Lil Nouns
                can vote on proposals or delegate their vote to a third party. A minimum of{' '}
                <span className={classes.boldText}>{nounThresholdCopy}</span> is required to submit
                proposals. A minimum of <span className={classes.boldText}>{'1 Lil Noun'}</span> is
                required to vote.
              </>
            ) : (
              <>
                Lil Nouns use Nouns collectivley purchased by the DAO to govern in{' '}
                <span className={classes.boldText}>{nounsDaoLink}</span>. Lil Nouners can use their
                lil nouns to vote on Nouns DAO proposals. Voting is free and is conducted via{' '}
                <span className={classes.boldText}>{snapshotLink}</span>. A minimum of{' '}
                <span className={classes.boldText}>{'1 Lil Noun'}</span> is required to vote.
              </>
            )}
          </p>

          <Row className={classes.treasuryInfoCard}>
            <Col lg={8} className={classes.treasuryAmtWrapper}>
              <Row className={classes.headerRow}>
                <span>Treasury</span>
              </Row>

              {isNounsDAOProp ? (
                <></>
              ) : (
                <Row>
                  <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                    <h1 className={classes.ethSymbol}>Ξ</h1>
                    <h1>
                      {treasuryBalance &&
                        Number(
                          Number(utils.formatEther(treasuryBalance)).toFixed(0),
                        ).toLocaleString('en-US')}
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
              )}

              <Row>
                <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                  <h1 className={classes.BigNounBalance}>
                    {nounCount}
                  </h1>
                  <h1>{' Nouns'}</h1>
                </Col>

                {!isMobile && (
                  <Col className={classes.usdTreasuryAmt}>
                    <Row className={classes.nounProfilePics}>
                      <NounImageInllineTable
                        nounIds={nounsInTreasury.accounts.length ? nounsInTreasury.accounts[0].nouns.flatMap(
                          (obj: { id: any }) => obj.id,
                        ) : []}
                      />
                    </Row>
                  </Col>
                )}
              </Row>
            </Col>
            <Col className={classes.treasuryInfoText}>
              {!isNounsDAOProp ? (
                <>
                  This treasury exists for <span className={classes.boldText}>Lil Nouns DAO</span>{' '}
                  participants to allocate resources for the long-term growth and prosperity of the
                  Lil Nouns project.
                </>
              ) : (
                <>
                  The Nouns purchased by Lil Nouns exists for{' '}
                  <span className={classes.boldText}>Lil Nouns DAO</span> participants to allocate
                  resources for the long-term growth and prosperity of the Nouns project.
                </>
              )}
            </Col>
          </Row>
        </>

        <Proposals
          proposals={proposals}
          nounsDAOProposals={bigNounProposals}
          snapshotProposals={snapshotProposalData.proposals.map((v: any, i: any) => ({
            ...v,
            proposalNo: i + 1,
          }))}
          isNounsDAOProp={isNounsDAOProp}
        />
      </Col>
    </Section>
  );
};
export default GovernancePage;
