import classes from './Banner.module.css';
import Section from '../../layout/Section';
import Image from 'react-bootstrap/Image';
import bannerImage from '../../assets/LilNounClassroom.png';
import { Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <div className={classes.wrapper}>
        <h1 style={{ textAlign: 'center' }}>
          ONE LIL NOUN,
          <br />
          EVERY 15 MINUTES,
          <br />
          FOREVER.
        </h1>
      </div>
      <div style={{ padding: '2rem', paddingBottom: '8rem' }}>


        <div className={classes.videoContainer}>
          <iframe
            width="1020"
            height="500"
            src="https://www.youtube.com/embed/gPA_0fh_XwI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        
        <small>
          This video was commissioned in{' '}
          <Nav.Link as={Link} to="/vote/89">
            Prop 89
          </Nav.Link>
        </small>
      </div>
    </Section>
  );
};

export default Banner;
