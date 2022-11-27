import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';

const Documentation = () => {
  const playgroundLink = <Link text="Playground" url="/playground" leavesPage={false} />;
  const nounsDao = <Link text="Nouns DAO" url="https://nouns.wtf" leavesPage={true} />;
  const publicDomainLink = (
    <Link
      text="public domain"
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link text="Compound Governance" url="https://compound.finance/governance" leavesPage={true} />
  );

  const lilBlockPartyLink = <Link text="Lil Block Party" url="https://lilblockparty.wtf" leavesPage={true} />;

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>WTF?</h1>
          <p className={classes.aboutText}>
            Lil Nouns are just like Nouns, but Lil!
            <br />
            <br />
            An expansion DAO based on {nounsDao}, Lil Nouns DAO works to create a new layer within
            the Nouns ecosystem; Nouns as kids. By expanding the ecosystem, Lil Nouns DAO aims at
            exposing more people to Nouns.
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            Learn more below, or start creating Lil Nouns off-chain using the {playgroundLink}.
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Summary</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Lil Nouns artwork is in the {publicDomainLink}.</li>
                <li>One Lil Noun is born and trustlessly auctioned every 15 minutes, forever.</li>
                <li>
                  100% of Lil Noun auction proceeds are trustlessly sent to the Lil Nouns treasury.
                </li>
                <li>Settlement of one auction kicks off the next.</li>
                <li>All Lil Nouns are members of Lil Nouns DAO.</li>
                <li>Lil Nouns DAO is backed by Nouns via Small Grants.</li>
                <li>Lil Nouns DAO uses Nouns DAO’s fork of  {compoundGovLink}.</li>
                <li>One Lil Noun is equal to one vote.</li>
                <li>The treasury is controlled exclusively by Lil Nouns via governance.</li>
                <li>Artwork is generative and stored directly on-chain (not IPFS).</li>
                <li>
                  No explicit rules exist for attribute scarcity; all Lil Nouns are equally rare.
                </li>
                <li>
                  Lil Nounders receive rewards in the form of Lil Nouns (10% of supply for first 5
                  years).
                </li>
                <li>
                  Nouns DAO receives rewards in the form of Lil Nouns (10% of supply for first 5
                  years).
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              15 Minute Auctions
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                The Lil Nouns Auction Contract will act as a self-sufficient Lil Noun generation and
                distribution mechanism, auctioning one Lil Noun every 15 minutes, forever. 100% of
                auction proceeds (ETH) are automatically deposited in the Lil Nouns DAO treasury,
                where they are governed by Lil Noun owners.
              </p>

              <p className={classes.aboutText}>
                Each time an auction is settled, the settlement transaction will also cause a new
                Lil Noun to be minted and a new 15 minute auction to begin.{' '}
              </p>
              <p>
                While settlement is most heavily incentivized for the winning bidder, it can be
                triggered by anyone, allowing the system to trustlessly auction Lil Nouns as long as
                Ethereum is operational and there are interested bidders.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Bidding and Settling Auctions
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <h3>Bids</h3>
                Once an auction starts, everyone has 15 minutes to bid. Anyone can bid an amount
                at/above 0.15 eth. The Amount bid is returned to bidder if they lose the auction
                (minus gas spent on bid transaction).
                <br />
                <br />
                Bids at the very last minute increase the auction time by 1 and a half minutes.
                Sometimes, multiple bids are sent at the same time. This may result in bids coming
                in and winning an auction at the very last minute/seconds (irrespective of time
                increase).
                <br />
                <p className={classes.aboutText}>
                  <h3>Bid Refunds</h3>
                  Unsuccessful bids are refunded in full. The timing of refunds may be offset by 1
                  bidder. This means that a refund is processed for an unsuccessful bid, when a
                  higher bid is submitted.
                </p>
              </p>

              <p className={classes.aboutText}>
                <h3>Settlement</h3>
                When an auction ends, a gas-only transaction is required to mint the current Lil
                Noun to the winners wallet and start the next auction. Anyone can settle an auction.
                As gas price fluctuates, the cost of settlement also fluctuates.
                <br />
                <br />
                Settlement gas price of every 9th Lil Noun is higher. This is due to the transaction
                also triggering 2 free Lil Noun mints: The Lil Nounders mint and The Nouns DAO mint.
                <br />
                <br />
                <h3>Settling Auctions through Lil Block Party</h3>
                Lil Nouns currently utilises a community built app called {lilBlockPartyLink} to settle its
                auctions.
                <br />
                <br />
                Lil Block Party gives prospective bidders the opportunity to select which Lil Noun
                they'd like to see auctioned next. It does this by monitoring Lil Noun seed changes
                per new ethereum block created. We recommend prospective bidders pick their
                favourite Lil Nouns pre-settlement via Lil Block Party.
                <br />
                <br />
                Alternatively, auction winners that solely care to mint the current Lil Noun to
                their wallet, can settle manually.
                <br />
                <br />
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Lil Nouns DAO</Accordion.Header>
            <Accordion.Body>
              Lil Nouns DAO utilizes Nouns DAO's fork of {compoundGovLink} and is the main governing
              body of the Lil Nouns ecosystem. The Lil Nouns DAO treasury receives 100% of ETH
              proceeds from daily Lil Noun auctions. Each Lil Noun is an irrevocable member of Lil
              Nouns DAO and entitled to one vote in all governance matters. Lil Noun votes are
              non-transferable (if you sell your Lil Noun the vote goes with it) but delegatable,
              which means you can assign your vote to someone else as long as you own your Lil Noun.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Governance ‘Slow Start’
            </Accordion.Header>
            <Accordion.Body>
              <p>
                In addition to the precautions taken by Compound Governance, Lil Nounders have given
                themselves a special veto right to ensure that no malicious proposals can be passed
                while the Lil Noun supply is low. This veto right will only be used if an obviously
                harmful governance proposal has been passed, and is intended as a last resort.
              </p>
              <p>
                Lil Nounders will proveably revoke this veto right when they deem it safe to do so.
                This decision will be based on a healthy Lil Noun distribution and a community that
                is engaged in the governance process.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Lil Noun Traits</Accordion.Header>
            <Accordion.Body>
              <p>
                Lil Nouns are generated randomly based Ethereum block hashes. There are no 'if'
                statements or other rules governing Lil Noun trait scarcity, which makes all Lil
                Nouns equally rare. As of this writing, Lil Nouns are made up of:
              </p>
              <ul>
                <li>backgrounds (2) </li>
                <li>bodies (30)</li>
                <li>accessories (140) </li>
                <li>heads (242) </li>
                <li>glasses (23)</li>
              </ul>
              You can experiment with off-chain Lil Noun generation at the {playgroundLink}.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              On-Chain Artwork
            </Accordion.Header>
            <Accordion.Body>
              <p>
                Lil Nouns are stored directly on Ethereum and do not utilize pointers to other
                networks such as IPFS. This is possible because Lil Noun parts are compressed and
                stored on-chain using a custom run-length encoding (RLE), which is a form of
                lossless compression.
              </p>

              <p>
                The compressed parts are efficiently converted into a single base64 encoded SVG
                image on-chain. To accomplish this, each part is decoded into an intermediate format
                before being converted into a series of SVG rects using batched, on-chain string
                concatenation. Once the entire SVG has been generated, it is base64 encoded.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Lil Noun Seeder Contract
            </Accordion.Header>
            <Accordion.Body>
              <p>
                The Lil Noun Seeder contract is used to determine Lil Noun traits during the minting
                process. The seeder contract can be replaced to allow for future trait generation
                algorithm upgrades. Additionally, it can be locked by the Lil Nouns DAO to prevent
                any future updates. Currently, Lil Noun traits are determined using pseudo-random
                number generation:
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p>
                Trait generation is not truly random. Traits can be predicted when minting a Lil
                Noun on the pending block.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="8" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Lil Nounder's Reward
            </Accordion.Header>
            <Accordion.Body>
              <p>
                'Lil Nounders' are the group of builders that initiated Lil Nouns. Here are the Lil
                Nounders:
              </p>
              <ul>
                <li>
                  <Link text="@0xsvg" url="https://twitter.com/0xsvg" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@adelidusiam"
                    url="https://twitter.com/adelidusiam"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@js_horne" url="https://twitter.com/js_horne" leavesPage={true} />
                </li>
                <li>
                  <Link text="@dg_goens" url="https://twitter.com/dg_goens" leavesPage={true} />
                </li>
              </ul>
              <p>
                Because 100% of Lil Noun auction proceeds are sent to Lil Nouns DAO, Lil Nounders
                have chosen to compensate themselves with Lil Nouns. Every 10th Lil Noun for the
                first 5 years of the project (Lil Noun ids #0, #10, #20, #30 and so on) will be
                automatically sent to the Lil Nounder's multisig to be vested and shared among the
                founding members of the project.
              </p>
              <p>
                Lil Nounder distributions don't interfere with the cadence of 15 minute auctions.
                Lil Nouns are sent directly to the Lil Nounder's Multisig, and auctions continue on
                schedule with the next available Lil Noun ID.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="9" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Nouns DAO's Reward
            </Accordion.Header>
            <Accordion.Body>
              <p>
                For being selfless stewards of cc0, Lil Nounders have chosen to compensate the Nouns
                DAO with Lil Nouns. Every 11th Lil Noun for the first 5 years of the project (Lil
                Noun ids #1, #11, #21, #31 and so on) will be automatically sent to the Nouns DAO to
                be vested and shared among members of the project.
              </p>
              <p>
                Nouns DAO distributions don't interfere with the cadence of 15 minute auctions. Lil
                Nouns are sent directly to the Nouns DAO Treasury, and auctions continue on schedule
                with the next available Lil Noun ID.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
