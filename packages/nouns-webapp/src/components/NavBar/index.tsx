import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import logoAlternate from '../../assets/logo_alternate.svg';
import { useEtherBalance } from '@usedapp/core';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import useLidoBalance from '../../hooks/useLidoBalance';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faUsers,
  faPlay,
  faComments,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/lilnoun/') ||
    history.location.pathname.includes('/auction/');

  const navLogo = useStateBg ? logo : logoAlternate;

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const [bigNounBalance, setBigNounBalance] = useState('...');

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
        return;
      })
      .catch(error => {
        console.log(`Nouns Owned Error ${error}`);
        return;
      });
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={navLogo} className={classes.navBarLogo} alt="Lil Nouns DAO logo" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}

            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                    treasuryStyle={nonWalletButtonStyle}
                    treasuryBigNounBalance={bigNounBalance}
                  />
                </Nav.Link>
              )}
            </Nav.Item>
          </div>
          <Navbar.Toggle className={classes.navBarToggle} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <>
              <div className="md:mx-4 my-4 font-bold">
                This is a test environment. Not real Lil Noun tokens.
              </div>
              <a
                className="no-underline"
                href="https://lumbar-drive-346.notion.site/lilsandbox-wtf-c660feaf344743359d084406cbcbb3cb"
              >
                <NavBarButton
                  buttonText={'Spec'}
                  buttonIcon={<FontAwesomeIcon icon={faLightbulb} />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </a>
              <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
            </>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
