/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubmitVoteInputOptions } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: submitIdeaVote
// ====================================================

export interface submitIdeaVote_submitIdeaVote_voter {
  __typename: "User";
  wallet: string;
  lilnounCount: number;
}

export interface submitIdeaVote_submitIdeaVote {
  __typename: "Vote";
  id: number;
  voterId: string;
  ideaId: number;
  direction: number;
  voter: submitIdeaVote_submitIdeaVote_voter;
}

export interface submitIdeaVote {
  submitIdeaVote: submitIdeaVote_submitIdeaVote;
}

export interface submitIdeaVoteVariables {
  options: SubmitVoteInputOptions;
}
