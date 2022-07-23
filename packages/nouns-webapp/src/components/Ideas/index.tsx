import { Alert, Button, Form } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useNounTokenBalance } from '../../wrappers/nounToken';
import classes from './Ideas.module.css';
import IdeaCard from '../IdeaCard';
import { Idea, useIdeas, SORT_BY } from '../../hooks/useIdeas';

const Ideas = () => {
  const { account } = useEthers();
  const history = useHistory();
  const { getIdeas, voteOnIdeaList, setSortBy } = useIdeas();

  const ideas = getIdeas();

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value);
  };

  const nounBalance = useNounTokenBalance(account || undefined) ?? 0;

  const nullStateCopy = () => {
    if (Boolean(account)) {
      return 'You have no Lil Nouns.';
    }
    return 'Connect wallet to submit an idea.';
  };

  const hasNouns = nounBalance > 0;

  return (
    <div>
      <div>
        <h3 className={classes.heading}>Ideas</h3>
        <div className={clsx('d-flex', classes.submitIdeaButtonWrapper)}>
          {ideas?.length > 0 && (
            <div className={classes.sortFilter}>
              <span className={classes.sortLabel}>Sort By:</span>
              <Form.Select aria-label="Order by" onChange={handleSortChange}>
                {Object.keys(SORT_BY).map(k => (
                  <option value={k} key={k}>
                    {SORT_BY[k]}
                  </option>
                ))}
              </Form.Select>
            </div>
          )}
          {account !== undefined && hasNouns ? (
            <Button className={classes.generateBtn} onClick={() => history.push('/ideas/create')}>
              Submit Idea
            </Button>
          ) : (
            <>
              <div className={classes.nullBtnWrapper}>
                <Button className={classes.generateBtnDisabled}>Submit Idea</Button>
              </div>
            </>
          )}
        </div>
      </div>
      {(!Boolean(account) || !hasNouns) && (
        <div className={classes.nullStateCopy}>{nullStateCopy()}</div>
      )}
      {ideas?.length ? (
        <span className="space-y-4">
          {ideas.map((idea: Idea, i) => {
            return (
              <IdeaCard
                idea={idea}
                key={`idea-${idea.id}`}
                voteOnIdea={voteOnIdeaList}
                nounBalance={nounBalance}
              />
            );
          })}
        </span>
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>No ideas found.</Alert.Heading>
          <p>Ideas submitted by community members will appear here.</p>
        </Alert>
      )}
    </div>
  );
};

export default Ideas;
