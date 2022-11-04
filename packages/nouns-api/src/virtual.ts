import { Idea } from '@prisma/client';

type UIIdea = Idea & { _count: { comments: number }; consensus: number; closed: boolean };

export const VirtualTags: { [key: string]: any } = {
  NEW: {
    type: 'NEW',
    label: 'New',
    color: 'orange',
    filterFn: (idea: UIIdea) => {
      if (idea.closed || (idea._count.comments > 0 && idea.consensus < 1)) {
        return false;
      }
      const today = new Date();
      const dTime = today.getTime() - idea.createdAt.getTime();
      const dDays = dTime / (1000 * 3600 * 24);

      return dDays < 7;
    },
  },
  DISCUSSION: {
    type: 'DISCUSSION',
    label: 'Discussion',
    color: 'pink',
    filterFn: (idea: UIIdea) => {
      return !idea.closed && idea._count.comments > 0 && idea.consensus < 1;
    },
  },
  CONSENSUS: {
    type: 'CONSENSUS',
    label: `consensus`,
    color: 'pink',
    filterFn: (idea: UIIdea) => {
      return !idea.closed && idea.consensus >= 1;
    },
  },
  CLOSED: {
    type: 'CLOSED',
    label: `Closed`,
    color: 'pink',
    filterFn: (idea: UIIdea) => {
      return idea.closed;
    },
  },
};
