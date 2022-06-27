import useSWR, { useSWRConfig } from 'swr';

const HOST = 'http://localhost:5001';

export const useIdeaAPI = () => {
  const { mutate } = useSWRConfig();
  const fetcher = (...args) => fetch(...args).then(res => res.json());

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
  };
};
