import React from 'react';
import classes from './NounersPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Image, Button } from 'react-bootstrap';
import banner_image from '../../assets/LilNounClassroomEmpty.png';

const NounersPage = () => {
  return (
    <Section fullWidth={true} className={classes.nounersPage}>
      <Col lg={{ span: 6, offset: 3 }}>

        <Row className={classes.headerRow}>
          <span>Lil Nouners</span>
          <h1>Welcome, Lil Nouner!</h1>
        </Row>
     
        <Row style={{ marginBottom: '0rem' }}>
          <Image src={banner_image} fluid />
        </Row>
        <br />
        <br />
                
        <Row className={classes.pictureCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>Next steps</span>
            </Row>
            <Row>
              <Col>
                So you just won a lil noun.... Cool! Be sure to go over how everything works and head over to our discord server to verify your lil noun! If you were already a member of the server, you have to leave and re-enter
              </Col>
            </Row>
          </Col>

          <Col className={classes.treasuryInfoText}>
            <div className={classes.verifyButtonWrapper}>
              <a href={`https://discord.gg/xjARUcB3tJ`}>
            <Button className={classes.generateBtn}>Head to #entry-channel</Button>
          </a>
            </div>
          </Col>
        </Row>
    

        <Col>
          {/* <h2> Getting Started</h2>
          <span className={classes.subheading}>
            Something about whhat this is. funding, community, etc
          </span>
        <br />
        <br /> */}

        </Col>
        <h2> Discord Channels</h2>
        {/* <Col style={{ textAlign: 'justify' }}>
          These days, there are a lot of different channels and channel groupings in the Discord.
          Here's a breakdown of what they're used for:
        </Col> */}
        <br />
          <h3>Start Here</h3>
          <Col style={{ textAlign: 'justify' }}>
            Basic information, major announcements, and user verification. If you just bought a
            Noun, you will need to verify your ownership in the #verify channel to get added to the
            green "Lil-Nouner" role of the server.
          </Col>
          <br />

          <h3>Lil Nouns DAO</h3>
          <Col style={{ textAlign: 'justify' }}>
            These are channels where only Lil Nouns DAO members can post. In the spirit of having an open
            and collaborative environment, all of these channels (except for #nouner-private) are
            viewable by the public.
          </Col>
          <br />
          
          <a
            href={`https://discord.com/channels/954142017556979752/954142017556979755`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #lil-nouner-general
          </a>
          <Col style={{ textAlign: 'justify' }}>
            This is where most communication between members occurs. Anything that doesn't fit in
            the other Lil Nouner channels likely goes here.
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/954142017556979752/954146402039119932`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #treasury-management
          </a>
          {/* <Col style={{ textAlign: 'justify' }}>
            There has been a lot of discussion about ways to optimize and grow our considerable
            treasury. The most popular discussion has been around ways to earn yield in the most
            conservative, risk-free way. We have deposited 1 ETH into Lido, but may look to expand
            that in the future. There has also been a great deal of discussion about diversifying
            some of the treasury into other assets.
          </Col> */}
          <br />
          <br />

          <a
            href={`https://discord.com/channels/954142017556979752/954146446603583558`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #dao-security
          </a>
          <Col style={{ textAlign: 'justify' }}>
            Discussion about potential vulnerabilities, whether smart contract or incentive based.
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/954142017556979752/966075869674213416`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #lil-nouner-private
          </a>
          <Col style={{ textAlign: 'justify' }}>
            While we generally prefer to keep everything out in the open, sometimes there are
            sensitive matters where information is only kept to members.
          </Col>
          <br />

          <h3>Projects</h3>
          <Col style={{ textAlign: 'justify' }}>
            When a project passes an on-chain vote, the creator of that proposal will often be given
            their own channel in this section to answer questions and share updates on the status of
            their work. This is a constantly expanding list - for more information on each of these,
            check out the DAO section of the Lil Nouns website.
          </Col>
          <br />

          <h3>Community</h3>
          <Col style={{ textAlign: 'justify' }}>
            These are channels where anyone, member or not, can post.
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/954142017556979752/954146487779078254`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #general
          </a>
          <Col style={{ textAlign: 'justify' }}>
            The most active channel, and the other are topic specific. Non-members often post in
            these channels asking for guidance on proposal ideas, or to share things they have made.
          </Col>
          <br />

          <h3>Voice Channels</h3>
          <a
            href={`https://discord.com/channels/954142017556979752/965642796289654804`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #voice-public
          </a>
          <Col style={{ textAlign: 'justify' }}>
            This is often used when someone is making a presentation intended for everyone and
            anyone to see
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/954142017556979752/966076040122355732`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #voice-private
          </a>
          <Col style={{ textAlign: 'justify' }}>
            This is for the Lil Nouns DAO Members Weekly Town Hall call (date and time TBD)
            Proposal Process: to be done - info on how a proposal is born, gets vetted, gets
            enacted, and how Lil Nouners can help
          </Col>
          <br />
          
      </Col>
    </Section>
  );
};

export default NounersPage;
