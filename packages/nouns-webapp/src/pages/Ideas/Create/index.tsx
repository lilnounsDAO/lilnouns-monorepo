import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Section from '../../../layout/Section';
import { useIdeas } from '../../../hooks/useIdeas';
import classes from '../Ideas.module.css';

enum FORM_VALIDATION {
  TITLE_MAX = 50,
  TITLE_MIN = 5,
  TLDR_MAX = 240,
  TLDR_MIN = 5,
  DESCRIPTION_MAX = 1080,
  DESCRIPTION_MIN = 5,
}

const CreateIdeaPage = () => {
  const history = useHistory();
  const { submitIdea } = useIdeas();

  const [title, setTitle] = useState<string>('');
  const [tldr, setTldr] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const titleValid =
    title.length <= FORM_VALIDATION.TITLE_MAX && title.length >= FORM_VALIDATION.TITLE_MIN;
  const tldrValid =
    tldr.length <= FORM_VALIDATION.TLDR_MAX && tldr.length >= FORM_VALIDATION.TLDR_MIN;
  const descriptionValid =
    description.length <= FORM_VALIDATION.DESCRIPTION_MAX &&
    description.length >= FORM_VALIDATION.DESCRIPTION_MIN;
  const formValid = titleValid && tldrValid && descriptionValid;

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
        <form
          className="space-y-8"
          id="submit-form"
          onSubmit={event => {
            event.preventDefault();

            if (!formValid) {
              return;
            }

            submitIdea({
              title,
              tldr,
              description,
            });
          }}
        >
          <div className="flex flex-col">
            <div className="flex justify-between w-full items-center">
              <label className="lodrina font-bold text-2xl mb-2">Title</label>
              <span className={`${!titleValid ? 'text-[#E40535]' : 'text-[#8C8D92]'}`}>
                {title.length}/{FORM_VALIDATION.TITLE_MAX}
              </span>
            </div>
            <input
              maxLength={FORM_VALIDATION.TITLE_MAX}
              minLength={FORM_VALIDATION.TITLE_MIN}
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
              <span className={`${!tldrValid ? 'text-[#E40535]' : 'text-[#8C8D92]'}`}>
                {tldr.length}/{FORM_VALIDATION.TLDR_MAX}
              </span>
            </div>
            <textarea
              maxLength={FORM_VALIDATION.TLDR_MAX}
              minLength={FORM_VALIDATION.TLDR_MIN}
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
              <span className={`${!descriptionValid ? 'text-[#E40535]' : 'text-[#8C8D92]'}`}>
                {description.length}/{FORM_VALIDATION.DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              maxLength={FORM_VALIDATION.DESCRIPTION_MAX}
              minLength={FORM_VALIDATION.DESCRIPTION_MIN}
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
              className={`rounded-lg ${
                formValid ? 'bg-[#2B83F6] text-white' : 'bg-[#F4F4F8] text-[#E2E3E8]'
              } font-bold p-2 rounded`}
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
