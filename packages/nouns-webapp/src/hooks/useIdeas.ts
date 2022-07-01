import { useState } from 'react';
import config from '../config';
import { useAuth } from './useAuth';
import { useApiError } from './useApiError';
import { useHistory } from 'react-router-dom';
import useSWR, { useSWRConfig, Fetcher } from 'swr';

export interface VoteFormData {
  id: number;
  direction: number;
  ideaId: number;
}

export interface CommentFormData {
  body: string;
  ideaId: number;
  parentId?: number;
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
  comments: Comment[];
}

export interface Comment {
  id: number;
  body: string;
  ideaId: number;
  parentId: number | null;
  authorId: string;
  replies: Reply[];
}

type Reply = Comment;

// Update the vote count for an idea after a new vote is recorded.
const updateVotesState = (ideas: Idea[], vote: Vote) => {
  const { ideaId, direction, voterId } = vote;
  const updatedIdeas = ideas.map(idea => {
    if (idea.id === ideaId) {
      let seenVote = false;
      const newIdeaVotes = idea.votes.map(v => {
        if (v.voterId === voterId) {
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
  return updatedIdeas;
};

const buildCommentState = (idea: Idea, newComment: Comment, parentId: number) => {
  let comments = [];
  if (parentId) {
    comments = idea.comments.map((comment: Comment) => {
      if (comment.id === parentId) {
        comment.replies = [...comment.replies, newComment];
      }

      return comment;
    });
  } else {
    comments = [...idea.comments, newComment];
  }

  return comments;
};

export const useIdeas = () => {
  const HOST = config.app.nounsApiUri;
  const { getAuthHeader, isLoggedIn, triggerSignIn } = useAuth();
  const { setError, error: errorModalVisible } = useApiError();
  const history = useHistory();
  const { mutate } = useSWRConfig();

  const fetcher: Fetcher = async (input: RequestInfo, init?: RequestInit, ...args: any[]) => {
    const res = await fetch(input, init);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const getIdeas = () => {
    const { data, error }: any = useSWR(`${HOST}/ideas`, fetcher);
    if (error && !errorModalVisible) {
      setError(error);
    }

    return data?.data as Idea[];
  };

  const getIdea = (id: string) => {
    const { data, error }: any = useSWR(`${HOST}/idea/${id}`, fetcher);

    if (error && !errorModalVisible) {
      setError(error);
    }

    return data?.data as Idea;
  };

  const castVote = async (formData: VoteFormData) => {
    const response = await fetch(`${HOST}/idea/vote`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to add vote');
    return response.json();
  };

  // Use to cast votes on the idea/:id page with optimistic updates and revalidation
  const voteOnIdea = (formData: VoteFormData) => {
    try {
      mutate(`${HOST}/idea/${formData.ideaId}`, async () => await castVote(formData), {
        optimisticData: (data: { data: Idea }) => {
          const idea = updateVotesState([data.data], formData as Vote);
          return { data: idea[0] };
        },
        rollbackOnError: true,
        populateCache: (mutationResult, currentData) => {
          const idea = updateVotesState([currentData.data], mutationResult.data as Vote);
          return { data: idea[0] };
        },
        revalidate: true,
      });
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your vote!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  // Use to comment and reply with optimistic updates and revalidation
  const commentOnIdea = (formData: any) => {
    try {
      mutate(
        `${HOST}/idea/${formData.ideaId}`,
        async () => {
          const response = await fetch(`${HOST}/idea/comment`, {
            method: 'POST',
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) throw new Error('Failed to add comment');
          return response.json();
        },
        {
          optimisticData: ({ data }: { data: Idea }) => {
            const comments = buildCommentState(
              data,
              { ...formData, replies: [], createdAt: 'Now', id: 0, timestamp: new Date() },
              formData.parentId,
            );

            const idea = { ...data, comments, timestamp: new Date() };

            return { data: idea };
          },
          rollbackOnError: true,
          populateCache: ({ data }: { data: Comment }, currentData: { data: Idea }) => {
            const comments = buildCommentState(currentData.data, data, formData.parentId);
            const idea = {
              ...currentData.data,
              comments: comments.filter(comment => comment.id !== 0),
            };
            return { data: idea };
          },
          revalidate: true,
        },
      );
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your comment!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  // Use to cast votes on the ideas list with optimistic updates and revalidation
  const voteOnIdeaList = (formData: VoteFormData) => {
    try {
      mutate(`${HOST}/ideas`, async () => await castVote(formData), {
        optimisticData: (data: { data: Idea[] }) => {
          const ideas = updateVotesState(data.data, formData as Vote);
          return { data: ideas };
        },
        rollbackOnError: true,
        populateCache: (mutationResult, currentData) => {
          const ideas = updateVotesState(currentData.data, mutationResult.data as Vote);
          return { data: ideas };
        },
        revalidate: true,
      });
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your vote!',
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

      const { data } = await res.json();

      if (!res.ok) {
        throw new Error('Failed to create Idea');
      }

      history.push(`/ideas/${data.id}`);
    } catch (e: any) {
      const error = {
        message: e.message || 'Failed to submit your idea!',
        status: e.status || 500,
      };
      setError(error);
    }
  };

  return {
    voteOnIdeaList: async (formData: VoteFormData) => {
      if (!isLoggedIn()) {
        try {
          await triggerSignIn();
          voteOnIdeaList(formData);
        } catch (e) {}
      } else {
        voteOnIdeaList(formData);
      }
    },
    voteOnIdea: async (formData: VoteFormData) => {
      if (!isLoggedIn()) {
        try {
          await triggerSignIn();
          voteOnIdea(formData);
        } catch (e) {}
      } else {
        voteOnIdea(formData);
      }
    },
    submitIdea: async (event: React.FormEvent<HTMLFormElement>) => {
      if (!isLoggedIn()) {
        try {
          await triggerSignIn();
          submitIdea(event);
        } catch (e) {}
      } else {
        submitIdea(event);
      }
    },
    commentOnIdea: async (formData: CommentFormData) => {
      if (!isLoggedIn()) {
        try {
          await triggerSignIn();
          commentOnIdea(formData);
        } catch (e) {}
      } else {
        commentOnIdea(formData);
      }
    },
    getIdeas,
    getIdea,
  };
};
