/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { useAuth as usePropLotAuth } from './hooks/useAuth';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import '../src/css/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import PreLaunch from './pages/PreLaunch';
import GovernancePage from './pages/Governance';
import CreateProposalPage from './pages/CreateProposal';
import VotePage from './pages/Vote';
import NounsVotePage from './pages/NounsVote';
import NoundersPage from './pages/Nounders';
import NounersPage from './pages/Nouners';
import NotFoundPage from './pages/NotFound';
import Playground from './pages/Playground';
import Nouniverse from './pages/Nouniverse';
import BadgesPage from './pages/Badges';
import config, { CHAIN_ID } from './config';
import { Col, Row } from 'react-bootstrap';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

import { AvatarProvider } from '@davatar/react';
import IdeasPage from './pages/Ideas';
import IdeaPage from './pages/Ideas/:id';
import PropLotUserProfilePage from './propLot/pages/PropLotUserProfile';
import CreateIdeaPage from './pages/Ideas/Create';
import DelegatePage from './pages/DelegatePage';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  const { logout } = usePropLotAuth();
  dayjs.extend(relativeTime);

  const alertModal = useAppSelector(state => state.application.alertModal);

  const isPreLaunch = config.isPreLaunch === 'true';
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  useEffect(() => {
    // Local account array updated
    if (Boolean(account && activeAccount) && account !== activeAccount) {
      logout();
    }

    dispatch(setActiveAccount(account));
  }, [account, dispatch, activeAccount]);

  return (
    <div className={`${classes.wrapper}`}>
      {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <>
          <AlertModal
            title={alertModal.title}
            content={
              <>
                <p>{alertModal.message}</p>

                {alertModal.isActionPrompt && (
                  <>
                    {
                      <Row>
                        <Col>
                          <button
                            className={classes.alertButton}
                            onClick={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
                          >
                            Cancel
                          </button>
                        </Col>
                        <Col>
                          <button className={classes.alertButton} onClick={alertModal.action}>
                            {alertModal.actionMessage}
                          </button>
                        </Col>
                      </Row>
                    }
                  </>
                )}
              </>
            }
            onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
          />
        </>
      )}
      <BrowserRouter>
        <AvatarProvider provider={chainId === 1 ? (library as any) : undefined} batchLookups={true}>
          <NavBar />

          {isPreLaunch ? (
            <Switch>
              <Route exact path="/" component={PreLaunch} />
              <Route exact path="/lilnounders" component={NoundersPage} />
              <Route exact path="/lilnouners" component={NounersPage} />
              <Route exact path="/playground" component={Playground} />
              <Route exact path="/nouniverse/:id" component={Nouniverse} />
              <Route exact path="/nouniverse" component={Nouniverse} />
              <Route component={NotFoundPage} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={AuctionPage} />
              <Route
                exact
                path="/lilnoun/:id"
                render={props => <AuctionPage initialAuctionId={Number(props.match.params.id)} />}
              />
              <Route exact path="/lilnounders" component={NoundersPage} />
              <Route exact path="/lilnouners" component={NounersPage} />
              <Route exact path="/create-proposal" component={CreateProposalPage} />
              <Route exact path="/vote" component={GovernancePage} />
              <Route exact path="/vote/nounsdao" component={GovernancePage} />
              <Route exact path={['/ideas', '/proplot']} component={IdeasPage} />
              <Route exact path={['/ideas/create', '/proplot/create']} component={CreateIdeaPage} />
              <Route exact path={['/ideas/:id', '/proplot/:id']} component={IdeaPage} />
              <Route exact path="/proplot/profile/:id" component={PropLotUserProfilePage} />
              <Route exact path="/vote/:id" component={VotePage} />
              <Route exact path="/vote/nounsdao/:id" component={NounsVotePage} />
              <Route exact path="/playground" component={Playground} />
              <Route exact path="/delegate" component={DelegatePage} />
              <Route exact path="/nouniverse/:id" component={Nouniverse} />
              <Route exact path="/nouniverse" component={Nouniverse} />
              <Route exact path="/badges" component={BadgesPage} />
              <Route component={NotFoundPage} />
            </Switch>
          )}
          <Footer />
        </AvatarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

// function timeout(delay: number) {
//   return new Promise(res => setTimeout(res, delay));
// }
