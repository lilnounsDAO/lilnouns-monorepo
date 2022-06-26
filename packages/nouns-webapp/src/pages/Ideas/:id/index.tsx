import { useState, useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Section from '../../../layout/Section';
import { useIdeas } from '../../../hooks/useIdeas';
import classes from '../Ideas.module.css';
import Cookies from 'js-cookie';

interface Idea {
  title: string;
  tldr: string;
  description: string;
}

const HOST = 'http://localhost:5001';

const IdeaPage = () => {
  const { getIdea } = useIdeas();
  const { id } = useParams() as { id: string };
  const history = useHistory();
  const [idea, setIdea] = useState<Idea>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const token = Cookies.get('lil-noun-token');

  useEffect(() => {
    getIdea(id).then(res => {
      setIdea(res);
    });
  }, [id]);

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

  if (!idea) {
    return <div>loading</div>;
  }

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <div>
            <span className="cursor-pointer inline-block" onClick={() => history.push('/ideas')}>
              Back
            </span>
          </div>
          <h1 className="mb-12">{idea.title}</h1>
        </Row>
        <div className="space-y-8">
          <div className="flex flex-col">
            <h3 className="lodrina font-bold text-2xl mb-2">tl:dr</h3>
            <p>{idea.tldr}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="lodrina font-bold text-2xl mb-2">Description</h3>
            <p>{idea.description}</p>
          </div>
        </div>
      </Col>
    </Section>
  );
};

export default IdeaPage;
