import useSWR, { useSWRConfig, Fetcher } from 'swr';
import { useAuth } from '../../hooks/useAuth';

const HOST = 'http://localhost:5001';

export interface Idea {
  id: number;
  title: string;
  tldr: string;
  description: string;
  votes: Vote[];
  comments: Comment[];
}

export interface Comment {
  authorId: string;
  body: string;
}

export interface Vote {
  direction: number;
  voterId: string;
}

export const useIdeaAPI = () => {
  const { getAuthHeader } = useAuth();
  const { mutate } = useSWRConfig();

  const fetcher: Fetcher = async (input: RequestInfo, init?: RequestInit, ...args: any[]) => {
    const res = await fetch(input, init);
    return res.json();
  };

  return {
    getIdeas: () => {
      const { data, error }: any = useSWR(`${HOST}/ideas`, fetcher);
      return data?.data as Idea[];
    },

    getIdea: (id: string) => {
      const { data, error }: any = useSWR(`${HOST}/idea/${id}`, fetcher);
      return data?.data as Idea;
    },

    getVotes: (id: string) => {
      const { data, error }: any = useSWR(`${HOST}/idea/${id}/votes`, fetcher);
      return data?.data as Vote[];
    },

    revalidateVotes: (id: string) => {
      mutate(`${HOST}/idea/${id}/votes`);
    },

    commentOnIdea: async (formData: any) => {
      try {
        const res = await fetch(`${HOST}/idea/comment`, {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const { data } = await res.json();

        if (res.status === 200) {
          console.log(data);
          return data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  };
};