import { useAuth } from './useAuth';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

const HOST = 'http://localhost:5001';

interface VoteFormData {
  direction: number;
  ideaId: number;
}

type SubmitError =
  | {
      message: string;
    }
  | undefined;

export const useIdeas = () => {
  const { getAuthHeader } = useAuth();
  const history = useHistory();
  const [error, setError] = useState(undefined as SubmitError);

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
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your vote!',
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
      };
      setError(error);
    }
  };

  const dismissError = () => setError(undefined);

  return {
    voteOnIdea,
    submitIdea,
    error,
    dismissError,
  };
};
