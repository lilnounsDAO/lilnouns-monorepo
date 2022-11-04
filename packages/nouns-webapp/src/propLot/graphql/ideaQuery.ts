import { gql } from '@apollo/client';

export const GET_IDEA_QUERY = gql`
  query getIdea($ideaId: Int!) {
    getIdea(options: { ideaId: $ideaId }) {
      id
      title
      tldr
      creatorId
      description
      votecount
      createdAt
      ideaStats {
        comments
      }
      closed
      consensus
      tags {
        type
        label
      }
      votes {
        id
        voterId
        ideaId
        direction
        voter {
          wallet
          lilnounCount
        }
      }
    }
  }
`;
