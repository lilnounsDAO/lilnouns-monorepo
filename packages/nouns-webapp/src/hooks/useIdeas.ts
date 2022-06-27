import { useState } from 'react';
import { useAuth } from './useAuth';

const HOST = 'http://localhost:5001';

interface IdeaFormData {
  title: string;
  tldr: string;
  description: string;
}

interface VoteFormData {
  direction: number;
  ideaId: number;
  voterAddress: string;
}

export const useIdeas = () => {
  const { getAuthHeader } = useAuth();
  const [ideas, setIdeas] = useState([]);

  const getIdeas = async () => {
    try {
      const res = await fetch(`${HOST}/ideas`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      const { data } = await res.json();

      if (res.status === 200) {
        setIdeas(data);
      }
    } catch (e) {
      console.log(e);
    }
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

      if (res.status === 200) {
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getIdea = async id => {
    try {
      const res = await fetch(`${HOST}/idea/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      const { data } = await res.json();

      if (res.status === 200) {
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Use to submit an idea
  const submitIdea = async (formData: IdeaFormData) => {
    try {
      const res = await fetch(`${HOST}/ideas`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const { data } = await res.json();
      if (res.status === 200) {
        setIdeas(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    ideas,
    getIdea,
    getIdeas,
    voteOnIdea,
    submitIdea,
  };
};
