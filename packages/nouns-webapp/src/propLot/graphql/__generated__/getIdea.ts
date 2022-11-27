/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getIdea
// ====================================================

export interface getIdea_getIdea_ideaStats {
  __typename: "IdeaStats";
  comments: number | null;
}

export interface getIdea_getIdea_tags {
  __typename: "IdeaTags";
  type: TagType;
  label: string;
}

export interface getIdea_getIdea_votes_voter {
  __typename: "User";
  wallet: string;
  lilnounCount: number;
}

export interface getIdea_getIdea_votes {
  __typename: "Vote";
  id: number;
  voterId: string;
  ideaId: number;
  direction: number;
  voter: getIdea_getIdea_votes_voter;
}

export interface getIdea_getIdea {
  __typename: "Idea";
  id: number;
  title: string;
  tldr: string;
  creatorId: string;
  description: string;
  votecount: number;
  createdAt: any;
  ideaStats: getIdea_getIdea_ideaStats | null;
  closed: boolean;
  consensus: number | null;
  tags: getIdea_getIdea_tags[] | null;
  votes: getIdea_getIdea_votes[] | null;
}

export interface getIdea {
  getIdea: getIdea_getIdea | null;
}

export interface getIdeaVariables {
  ideaId: number;
}
