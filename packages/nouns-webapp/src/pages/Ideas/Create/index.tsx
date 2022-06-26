import { Col, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Section from '../../../layout/Section';
import { useIdeas } from '../../../hooks/useIdeas';
import classes from '../Ideas.module.css';

const CreateIdeaPage = () => {
  const history = useHistory();
  const { submitIdea } = useIdeas();

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <div>
            <span className="cursor-pointer inline-block" onClick={() => history.push('/ideas')}>
              Back
            </span>
          </div>
          <h1>Submit an Idea</h1>
        </Row>
        <p className={classes.subheading}>
          You must hold at least one lil noun in order to submit an idea and vote on others. There
          is no limit to the number of ideas you can submit and vote on.
        </p>
        <form className="space-y-8" id="submit-form" onSubmit={data => submitIdea(data)}>
          <div className="flex flex-col">
            <label className="lodrina font-bold text-2xl mb-2">Title</label>
            <input
              type="text"
              name="title"
              className="border rounded-lg p-2"
              placeholder="Give your idea a name..."
            />
          </div>
          <div className="flex flex-col">
            <label className="lodrina font-bold text-2xl mb-2">tr;dr</label>
            <textarea
              name="tldr"
              className="border rounded-lg p-2"
              placeholder="In the simplest language possible, describe your idea in a few sentances..."
            />
          </div>
          <div className="flex flex-col">
            <label className="lodrina font-bold text-2xl mb-2">Description</label>
            <textarea
              name="description"
              className="border rounded-lg p-2"
              placeholder="Describe your idea in full..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Col>
    </Section>
  );
};

export default CreateIdeaPage;
