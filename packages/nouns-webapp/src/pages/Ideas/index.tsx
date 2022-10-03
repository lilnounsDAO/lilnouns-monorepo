import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import Ideas from '../../components/Ideas';
import PropLotHome from '../../propLot/pages/PropLotHome';

import config from '../../config';

import classes from './Ideas.module.css';

const IdeasPage = () => {
  const nounsRequired = 1;
  const nounThresholdCopy = `${nounsRequired} Lil Noun`;
  const isPropLotV2Enabled = config.isPropLotBetaEnabled;

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Contribute</span>
          <h1>Submit & Vote on New Ideas</h1>
        </Row>
        <p className={classes.subheading}>
          A minimum of <span className={classes.boldText}>{nounThresholdCopy}</span> is required to
          submit an idea and vote on others. There is no limit to the number of ideas you can submit
          and vote on.
        </p>
        {isPropLotV2Enabled ? <PropLotHome /> : <Ideas />}
      </Col>
    </Section>
  );
};
export default IdeasPage;
