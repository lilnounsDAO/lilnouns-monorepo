import { useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Section from '../../../layout/Section';
import Modal from '../../../components/Modal';
import classes from '../Ideas.module.css';
import Cookies from 'js-cookie';

const HOST = 'http://localhost:5001';

const CreateIdeaPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const token = Cookies.get('lil-noun-token');

  const submitIdea = async () => {
    const form = document.getElementById('submit-form') as HTMLFormElement;
    const formData = new FormData(form);
    const params = {};
    formData.forEach((value, key) => (params[key] = value));

    const res = await fetch(`${HOST}/ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (res.status === 200) {
      // const { data } = await res.json();
      setModalOpen(true);
    } else {
      // error
    }
  };

  return (
    <Section fullWidth={false} className={classes.section}>
      {modalOpen && (
        <Modal
          title="Success"
          content="Idea submitted!"
          onDismiss={() => {
            setModalOpen(false);
            const form = document.getElementById('submit-form') as HTMLFormElement;
            form.reset();
          }}
        />
      )}
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Back</span>
          <h1>Submit an Idea</h1>
        </Row>
        <p className={classes.subheading}>
          You must hold at least one lil noun in order to submit an idea and vote on others. There
          is no limit to the number of ideas you can submit and vote on.
        </p>
        <form className="space-y-8" id="submit-form">
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
            <Button
              onClick={() => {
                submitIdea();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Col>
    </Section>
  );
};

export default CreateIdeaPage;
