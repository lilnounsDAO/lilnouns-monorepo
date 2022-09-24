import { Stack } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import classes from './Badges.module.css';
import LilNounsBg from '../../assets/lil-nouners-bg.png';
import LilNounsBgMobile from '../../assets/lil-nouners-bg-mobile.png';
import Badges from '../../assets/badges.png';

const BadgesPage = () => {
  return (
    <>
      <Stack className={classes.heroSection} gap={5}>
        <Stack className={classes.heroSectionLeft} direction="vertical" gap={3}>
          <h1 className={classes.heroSectionHeader}>It’s time you get rewarded for actively participating in PropLot.</h1>
          <p className={classes.heroSectionDesc}>The PropLot Contributor Badge is created to reward the top contributors for 
            actively participating in the creation of new ideas & voting.</p>
          <Button className={classes.heroSectionBtn}>
            Claim your Badge
          </Button>
        </Stack>
        <Stack className={classes.heroSectionRight}>
          <picture>
          <source media="(max-width: 992px)" srcSet={LilNounsBgMobile} className={classes.heroSectionBg} />
            <img src={LilNounsBg} className={classes.heroSectionBg} />
          </picture>
        </Stack>
      </Stack>
    
      <Stack className={classes.badgeSection} gap={5}>
        <Stack className={classes.badgeSectionLeft} direction="vertical" gap={3}>
          <h1 className={classes.badgeSectionHeader}>HOW IT WORKS</h1>
          <p className={classes.badgeSectionDesc}>In the beginning, all the ideas that have a vote count of  <b>50</b> & voters, who
          have voted on atleast <b>15</b> ideas, can claim the badge. As we move forward, we plan to scale up these numbers so there's
          always something for everyone.</p>
        </Stack>
        <Stack className={classes.badgeSectionRight}>
          <img src={Badges} className={classes.badgeSectionBg} />
        </Stack>
      </Stack>
   </>
  );
};

export default BadgesPage;
