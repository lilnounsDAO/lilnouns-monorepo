import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import Ideas from '../../components/Ideas';
import classes from './Ideas.module.css';

const IdeasPage = () => {
  const nounsRequired = 1;
  const nounThresholdCopy = `${nounsRequired} Lil Noun`;

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
        <Ideas />
      </Col>
    </Section>
  );
};
export default IdeasPage;
