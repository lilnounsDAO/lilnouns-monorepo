import { useState } from 'react';
import config from '../config';
import { useAuth } from './useAuth';
import { useApiError } from './useApiError';
import { useHistory } from 'react-router-dom';

export interface VoteFormData {
  direction: number;
  ideaId: number;
}

export interface Vote {
  id: number;
  voterId: string;
  ideaId: number;
  direction: number;
}

export interface Idea {
  id: number;
  title: string;
  tldr: string;
  description: string;
  votes: Vote[];
  creatorId: string;
}

export const useIdeas = () => {
  const HOST = config.app.nounsApiUri;
  const { getAuthHeader, isLoggedIn, triggerSignIn } = useAuth();
  const { setError } = useApiError();
  const history = useHistory();

  const [ideas, setIdeas] = useState([] as Idea[]);

  // Update the vote count for an idea after a new vote is recorded.
  const updateVotesState = (vote: Vote) => {
    const { id, ideaId, direction } = vote;
    const updatedIdeas = ideas.map(idea => {
      if (idea.id === ideaId) {
        let seenVote = false;
        const newIdeaVotes = idea.votes.map(vote => {
          if (id === vote.id) {
            seenVote = true;
            return { ...vote, direction };
          } else {
            return vote;
          }
        });

        if (!seenVote) {
          newIdeaVotes.push(vote);
        }

        return { ...idea, votes: newIdeaVotes };
      }

      return idea;
    }) as Idea[];

    console.log(ideas);
    console.log(updatedIdeas);
    return setIdeas(updatedIdeas);
  };

  const voteOnIdea = async (formData: VoteFormData) => {
    try {
      const res = await fetch(`${HOST}/idea/vote`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const { data } = await res.json();

      return updateVotesState(data as Vote);
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your vote!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  const getIdeas = async () => {
    try {
      const res = await fetch(`${HOST}/ideas`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      const { data } = await res.json();

      setIdeas(data);
    } catch (e: any) {
      console.log(e);
      const error = {
        message: e.message || 'Failed to fetch ideas!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  // Use to submit an idea
  const submitIdea = async (event: React.FormEvent<HTMLFormElement>) => {
    interface FormDataElements extends HTMLFormControlsCollection {
      title: HTMLInputElement;
      tldr: HTMLTextAreaElement;
      description: HTMLTextAreaElement;
    }
    event.preventDefault();

    const { title, tldr, description } = event.currentTarget.elements as FormDataElements;

    try {
      const res = await fetch(`${HOST}/ideas`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.value,
          tldr: tldr.value,
          description: description.value,
        }),
      });

      if (res.status === 200) {
        const { data } = await res.json();
        history.push(`/ideas/${data.id}`);
      }
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your idea!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  return {
    voteOnIdea: async (formData: VoteFormData) => {
      if (!isLoggedIn) {
        try {
          await triggerSignIn();
          voteOnIdea(formData);
        } catch (e) {}
      } else {
        voteOnIdea(formData);
      }
    },
    submitIdea: async (event: React.FormEvent<HTMLFormElement>) => {
      if (!isLoggedIn) {
        try {
          await triggerSignIn();
          submitIdea(event);
        } catch (e) {}
      } else {
        submitIdea(event);
      }
    },
    getIdeas,
    ideas,
  };
};
