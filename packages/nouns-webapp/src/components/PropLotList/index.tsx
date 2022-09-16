import { Alert, Button, Form } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import {useEffect, useState} from 'react';
import clsx from 'clsx';
import { useAccountVotes } from '../../wrappers/nounToken';
import classes from './PropLotList.module.css';
import IdeaCard from '../IdeaCard';
import { Idea, useIdeas, SORT_BY } from '../../hooks/useIdeas';
import { useQuery } from '@apollo/client';
import { propLotQuery } from './propLotQuery';
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PropLotList = () => {
  const { account } = useEthers();
  const history = useHistory();
  const { voteOnIdeaList, setSortBy } = useIdeas();

  const { loading, error, data, refetch } = useQuery(propLotQuery(), {
    context: { clientName: 'PropLot' },
    variables: {
      options: {
        requestUUID: 'abc',
        filters: [],
      }
    }
  });

  const [filters, updateFilters] = useState(data?.propLot?.metadata?.appliedFilters || []);
  const handleUpdateFilters = (param: { key: string, value: string }) => {

    // handle multi select and single select options differently here

    updateFilters([...filters.filter((f: { key: string, value: string }) => f.key !== param.key), { key: param.key, value: param.value }])
  }

  useEffect(() => {
    console.log(filters);
    refetch({ options: { requestUUID: "123", filters } });
  }, [filters])

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value);
  };

  const nounBalance = useAccountVotes(account || undefined) ?? 0;

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
        <div className={clsx('d-flex', classes.submitIdeaButtonWrapper)}>
          <h3 className={classes.heading}>Ideas</h3>
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

      {data?.propLot?.sections?.map((section: any) => {
        if(section.__typename === 'UIPropLotComponentList') {
          return (
            <span className="space-y-4" key={section.__typename}>
              {
                section.list.map((item: any, i: any) => {
                  if (item.__typename === 'UIIdeaRow') {
                    return (
                      <IdeaCard
                        idea={item.data}
                        key={`idea-${item.data.id}`}
                        voteOnIdea={voteOnIdeaList}
                        nounBalance={nounBalance}
                      />
                    );
                  }
                  return null;
                })
              }
            </span>
          );
        }

        if(section.__typename === 'UIPropLotFilterBar') {
          const {
            sortPills,
            filterPills,
            filterDropdown,
          } = section;

          return (
            <div className="mt-2 mb-2">
              {
                sortPills.pills.map((pill: any, i: any) => {
                  if (pill.__typename === 'UITogglePill') {
                    return (
                      <TogglePill key={section.__typename + i} pill={pill} updateFilters={handleUpdateFilters}/>
                    );
                  }
                  return null;
                })
              }
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const TogglePill = ({ pill, updateFilters }: {pill: any, updateFilters: any}) => {
  const [selectedPill, setSelectedPill] = useState(pill.options?.find((opt: any) => opt.selected));
  const [dir, setDir] = useState('UP')
  const unselectedPill = selectedPill && pill.options?.find((opt: any) => opt.id !== selectedPill.id);
  const defaultValue = pill.options?.[0];

  useEffect(() => {
    setSelectedPill(pill.options?.find((opt: any) => opt.selected))
  }, [pill])

  return <span className="mr-2">
    <Button onClick={() => {
      console.log(unselectedPill)
      updateFilters(selectedPill ? unselectedPill.target.param : defaultValue.target.param)
      setSelectedPill(selectedPill ? unselectedPill : defaultValue)
      setDir(dir === "DOWN" ? "UP" : "DOWN")
    }}
    variant={selectedPill ? "primary" : "light"}
    >
      {pill.label} <FontAwesomeIcon icon={dir === 'UP' ? faArrowCircleUp: faArrowCircleDown} />
    </Button>
  </span>
}

export default PropLotList;
