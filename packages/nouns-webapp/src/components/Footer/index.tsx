import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import Link from '../Link';
import FeelingNounishButton from '../FeelingNounishButton';
import { isMobileScreen } from '../../utils/isMobile';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const discourseURL = externalURL(ExternalURL.discourse);
  const isMobile = isMobileScreen();
  const currentRoute = window.location.pathname
  const isFooterFriendly = !currentRoute.includes('vote') && !currentRoute.includes('proplot')
  console.log(`isFooterFriendly: ${isFooterFriendly}`);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          {/* {!isMobile && isFooterFriendly ? <FeelingNounishButton /> : <></> } */}
          <div className={classes.footerLinks}>
            <Link text="Discord" url={discordURL} leavesPage={true} />
            <Link text="Twitter" url={twitterURL} leavesPage={true} />
            <Link text="Etherscan" url={etherscanURL} leavesPage={true} />
            <Link text="Forums" url={discourseURL} leavesPage={false} />
          </div>
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
