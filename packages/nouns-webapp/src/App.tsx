import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
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
import NoundersPage from './pages/Nounders';
import NounersPage from './pages/Nouners';
import NotFoundPage from './pages/NotFound';
import Playground from './pages/Playground';
import Nouniverse from './pages/Nouniverse';
import config, { CHAIN_ID } from './config';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

// import emojiPage from './pages/Emojis';
import EmojiBubble from './components/EmojiShower/EmojiBubble';

function App() {
  const { account, chainId } = useEthers();
  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  const alertModal = useAppSelector(state => state.application.alertModal);

  const [emojiQueue, setEmojiQueue] = useState(['']);
  const [isFirst, setIsFirst] = useState(false);

  const randomSize = (min: number, max: number) =>
    (Math.random() * (max - min + 1) + min).toFixed(2);

  const randomLeft = () => {
    const maths = Math.floor(Math.random() * 97 + 1);
    console.log(`RANDOMLEFT: ${maths}`);
    return maths;
  };

  const isPreLaunch = config.isPreLaunch === 'true'

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const emojiBubbleMarkup = emojiQueue.map((emojiVals, i) => (
    <EmojiBubble key={i} {...emojiVals} />
  ));

  return (
    <div className={`${classes.wrapper}`}>
      {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <>
          <AlertModal
            title={alertModal.title}
            content={
              <p>{alertModal.message}</p>
            }
            onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
          />
      
          {alertModal.isMilestone && <> 
            {emojiBubbleMarkup}
          </>}

        </>
      )}
      <BrowserRouter>
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
          <Route exact path="/vote/:id" component={VotePage} />
          <Route exact path="/playground" component={Playground} />
          <Route exact path="/nouniverse/:id" component={Nouniverse} />
          <Route exact path="/nouniverse" component={Nouniverse} />
          <Route component={NotFoundPage} />
        </Switch>
        )}

    


        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}
