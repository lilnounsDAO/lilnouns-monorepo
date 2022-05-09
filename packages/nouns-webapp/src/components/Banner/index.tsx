import classes from './Banner.module.css';
import Section from '../../layout/Section';
import Image from 'react-bootstrap/Image';
import bannerImage from '../../assets/LilNounClassroom.png';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
        <div className={classes.wrapper}>
          <h1 style={{textAlign:'center'}}>
            ONE LIL NOUN,
            <br />
            EVERY 15 MINUTES,
            <br />
            FOREVER.
          </h1>
        </div>
        <div style={{ padding: '2rem', paddingBottom: '8rem'}}>
          <Image  src={bannerImage} alt={'Banner Image'} fluid />
        </div>
    </Section>
  );
};

export default Banner;
