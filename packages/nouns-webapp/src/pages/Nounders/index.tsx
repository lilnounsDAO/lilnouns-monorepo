import React from 'react';
import classes from './NoundersPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import pfp0xsvg from '../../assets/nounder-pfps/0xsvg.png';
import pfpadelidusiam from '../../assets/nounder-pfps/adelidusiam.jpg';
import pfpblequity from '../../assets/nounder-pfps/pfpblequity.webp';
import pfpjacob from '../../assets/nounder-pfps/pfpjacob.webp';

const bios = [
  {
    name: 'adelidusiam',
    image: pfpadelidusiam,
    description: undefined,
    handle: 'adelidusiam',
  },
  {
    name: '0xsvg',
    image: pfp0xsvg,
    description: undefined,
    handle: '0xsvg',
  },
  {
    name: 'Jacob.eth',
    image: pfpjacob,
    description: undefined,
    handle: 'js_horne',
  },
  {
    name: 'Blequity',
    image: pfpblequity,
    description: undefined,
    handle: 'dg_goens',
  },
];

const BioCard: React.FC<{
  name: string;
  description?: string | undefined;
  image: string;
  handle?: string | undefined;
}> = props => {
  const { name, description, image, handle } = props;
  return (
    <>
      <Card.Img variant="top" src={image} />
      <Card.Title>
        {handle && (
          <a href={`https://twitter.com/${handle}`} target="_blank" rel="noreferrer">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={classes.twitterIcon}
              data-v-6cab4e66=""
            >
              <path
                d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                data-v-6cab4e66=""
              ></path>
            </svg>
            {name}
          </a>
        )}

        {!handle && name}
      </Card.Title>
      {description && <Card.Text>{description}</Card.Text>}
    </>
  );
};

const BioCards: React.FC<{ min: number; max: number }> = props => {
  const { min, max } = props;
  return (
    <>
      {bios.slice(min, max).map(bio => (
        <Col xs={6} md={3} lg={3} className={classes.bioGroup}>
          <BioCard {...bio} />
        </Col>
      ))}
    </>
  );
};

const NoundersPage = () => {
  return (
    <Section fullWidth={true} className={classes.noundersPage}>
      <Col lg={{ span: 6, offset: 3 }}>
        <h2 style={{ marginBottom: '2rem' }}>The Lil Nounders</h2>
        <Row style={{ marginBottom: '0rem' }}>
          <BioCards min={0} max={5} />
          <BioCards min={5} max={10} />
        </Row>
        <h3>Lil Nounders' Reward</h3>
        <p style={{ textAlign: 'justify' }}>
          All Lil Noun auction proceeds are sent to the Lil Nouns DAO. For this reason, we, the
          project's founders (‘Lil Nounders’) have chosen to compensate ourselves with Lil Nouns.
          Every 10th noun for the first 5 years of the project will be sent to our multisig, where
          it will be vested and distributed to individual Lil Nounders.
        </p>
        <p style={{ textAlign: 'justify' }}>
          The Lil Nounders reward is intended as compensation for our pre and post-launch
          contributions to the project, and to help us participate meaningfully in governance as the
          project matures.
        </p>
      </Col>
    </Section>
  );
};

export default NoundersPage;
