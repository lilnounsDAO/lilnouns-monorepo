import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Section from '../../../layout/Section';
import { useIdeas } from '../../../hooks/useIdeas';
import classes from '../Ideas.module.css';

const CreateIdeaPage = () => {
  const history = useHistory();
  const { submitIdea } = useIdeas();

  const [title, setTitle] = useState<string>('');
  const [tldr, setTldr] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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
            <div className="flex justify-between w-full items-center">
              <label className="lodrina font-bold text-2xl mb-2">Title</label>
              <span
                className={`${title.length === 50 ? 'text-red-500 font-bold' : 'text-gray-500'}`}
              >
                {title.length}/50
              </span>
            </div>
            <input
              maxLength={50}
              value={title}
              onChange={e => setTitle(e.target.value)}
              type="text"
              name="title"
              className="border rounded-lg p-2"
              placeholder="Give your idea a name..."
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between w-full items-center">
              <label className="lodrina font-bold text-2xl mb-2">tl;dr</label>
              <span
                className={`${tldr.length === 240 ? 'text-red-500 font-bold' : 'text-gray-500'}`}
              >
                {tldr.length}/240
              </span>
            </div>
            <textarea
              maxLength={240}
              value={tldr}
              onChange={e => setTldr(e.target.value)}
              name="tldr"
              className="border rounded-lg p-2 min-h-[120px]"
              placeholder="In the simplest language possible, describe your idea in a few sentances..."
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between w-full items-center">
              <label className="lodrina font-bold text-2xl mb-2">Description</label>
              <span
                className={`${
                  description.length === 1080 ? 'text-red-500 font-bold' : 'text-gray-500'
                }`}
              >
                {description.length}/1080
              </span>
            </div>
            <textarea
              maxLength={1080}
              value={description}
              onChange={e => setDescription(e.target.value)}
              name="description"
              className="border rounded-lg p-2 min-h-[240px]"
              placeholder="Describe your idea in full..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-[#2B83F6] text-white font-bold p-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </Col>
    </Section>
  );
};

export default CreateIdeaPage;
