/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PropLotInputOptions, FilterType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPropLot
// ====================================================

export interface getPropLot_propLot_ideas_ideaStats {
  __typename: "IdeaStats";
  comments: number | null;
}

export interface getPropLot_propLot_ideas_votes_voter {
  __typename: "User";
  wallet: string;
  lilnounCount: number;
}

export interface getPropLot_propLot_ideas_votes {
  __typename: "Vote";
  id: number;
  voterId: string;
  ideaId: number;
  direction: number;
  voter: getPropLot_propLot_ideas_votes_voter;
}

export interface getPropLot_propLot_ideas {
  __typename: "Idea";
  id: number;
  title: string;
  tldr: string;
  creatorId: string;
  description: string;
  votecount: number;
  createdAt: string;
  ideaStats: getPropLot_propLot_ideas_ideaStats | null;
  votes: getPropLot_propLot_ideas_votes[] | null;
}

export interface getPropLot_propLot_sortFilter_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface getPropLot_propLot_sortFilter {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: getPropLot_propLot_sortFilter_options[];
}

export interface getPropLot_propLot_dateFilter_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface getPropLot_propLot_dateFilter {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: getPropLot_propLot_dateFilter_options[];
}

export interface getPropLot_propLot_tagFilter_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface getPropLot_propLot_tagFilter {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: getPropLot_propLot_tagFilter_options[];
}

export interface getPropLot_propLot_metadata {
  __typename: "PropLotResponseMetadata";
  requestUUID: string;
  appliedFilters: string[] | null;
}

export interface getPropLot_propLot {
  __typename: "PropLotResponse";
  ideas: getPropLot_propLot_ideas[] | null;
  sortFilter: getPropLot_propLot_sortFilter | null;
  dateFilter: getPropLot_propLot_dateFilter | null;
  tagFilter: getPropLot_propLot_tagFilter | null;
  metadata: getPropLot_propLot_metadata;
}

export interface getPropLot {
  propLot: getPropLot_propLot;
}

export interface getPropLotVariables {
  options: PropLotInputOptions;
}
