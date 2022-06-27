import useSWR, { useSWRConfig, Fetcher } from 'swr';
import { useAuth } from '../../hooks/useAuth';

const HOST = 'http://localhost:5001';

export const useIdeaAPI = () => {
  const { getAuthHeader } = useAuth();
  const { mutate } = useSWRConfig();
  const fetcher: Fetcher = (...args) => fetch(...args).then(res => res.json());

  return {
    getIdeas: () => {
      const { data, error } = useSWR(`${HOST}/ideas`, fetcher);
      return data?.data;
    },

    getIdea: (id: string) => {
      const { data, error } = useSWR(`${HOST}/idea/${id}`, fetcher);
      return data?.data;
    },

    getVotes: (id: string) => {
      const { data, error } = useSWR(`${HOST}/idea/${id}/votes`, fetcher);
      console.log(data);
      return data?.data;
    },

    revalidateVotes: (id: string) => {
      mutate(`${HOST}/idea/${id}/votes`);
    },

    commentOnIdea: async formData => {
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
