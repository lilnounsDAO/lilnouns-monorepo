import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import Ideas from '../../components/Ideas';
import PropLotHome from '../../propLot/pages/PropLotHome';

import config from '../../config';

import classes from './Ideas.module.css';

const IdeasPage = () => {
  const isPropLotV2Enabled = config.isPropLotBetaEnabled;

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Prop Lot</span>
          <h1>Submissions</h1>
        </Row>
        {isPropLotV2Enabled ? <PropLotHome /> : <Ideas />}
      </Col>
    </Section>
  );
};
export default IdeasPage;
