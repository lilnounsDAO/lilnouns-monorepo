import { gql } from '@apollo/client';

export const SUBMIT_VOTE_MUTATION = gql`
  mutation submitIdeaVote($options: SubmitVoteInputOptions!) {
    submitIdeaVote(options: $options) {
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
`;
