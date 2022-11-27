/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PropLotProfileInputOptions, TagType, FilterType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPropLotProfile
// ====================================================

export interface getPropLotProfile_propLotProfile_profile_user_userStats {
  __typename: "UserStats";
  totalVotes: number | null;
  totalUpvotes: number | null;
  totalDownvotes: number | null;
  totalComments: number | null;
  totalIdeas: number | null;
  netVotesReceived: number | null;
  downvotesReceived: number | null;
  upvotesReceived: number | null;
}

export interface getPropLotProfile_propLotProfile_profile_user {
  __typename: "User";
  wallet: string;
  lilnounCount: number;
  userStats: getPropLotProfile_propLotProfile_profile_user_userStats | null;
}

export interface getPropLotProfile_propLotProfile_profile {
  __typename: "PropLotUserProfile";
  user: getPropLotProfile_propLotProfile_profile_user;
}

export interface getPropLotProfile_propLotProfile_list_Comment_parent {
  __typename: "CommentParent";
  id: number;
  body: string;
  ideaId: number;
  authorId: string;
  createdAt: any;
}

export interface getPropLotProfile_propLotProfile_list_Comment_idea {
  __typename: "Idea";
  id: number;
  title: string;
  creatorId: string;
  closed: boolean;
  consensus: number | null;
}

export interface getPropLotProfile_propLotProfile_list_Comment {
  __typename: "Comment";
  id: number;
  body: string;
  ideaId: number;
  parentId: number | null;
  authorId: string;
  createdAt: any;
  parent: getPropLotProfile_propLotProfile_list_Comment_parent | null;
  idea: getPropLotProfile_propLotProfile_list_Comment_idea | null;
}

export interface getPropLotProfile_propLotProfile_list_Idea_ideaStats {
  __typename: "IdeaStats";
  comments: number | null;
}

export interface getPropLotProfile_propLotProfile_list_Idea_tags {
  __typename: "IdeaTags";
  type: TagType;
  label: string;
}

export interface getPropLotProfile_propLotProfile_list_Idea_votes_voter {
  __typename: "User";
  wallet: string;
  lilnounCount: number;
}

export interface getPropLotProfile_propLotProfile_list_Idea_votes {
  __typename: "Vote";
  id: number;
  voterId: string;
  ideaId: number;
  direction: number;
  voter: getPropLotProfile_propLotProfile_list_Idea_votes_voter;
}

export interface getPropLotProfile_propLotProfile_list_Idea {
  __typename: "Idea";
  id: number;
  title: string;
  tldr: string;
  creatorId: string;
  description: string;
  votecount: number;
  createdAt: any;
  ideaStats: getPropLotProfile_propLotProfile_list_Idea_ideaStats | null;
  closed: boolean;
  consensus: number | null;
  tags: getPropLotProfile_propLotProfile_list_Idea_tags[] | null;
  votes: getPropLotProfile_propLotProfile_list_Idea_votes[] | null;
}

export type getPropLotProfile_propLotProfile_list = getPropLotProfile_propLotProfile_list_Comment | getPropLotProfile_propLotProfile_list_Idea;

export interface getPropLotProfile_propLotProfile_sortFilter_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface getPropLotProfile_propLotProfile_sortFilter {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: getPropLotProfile_propLotProfile_sortFilter_options[];
}

export interface getPropLotProfile_propLotProfile_tabFilter_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface getPropLotProfile_propLotProfile_tabFilter {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: getPropLotProfile_propLotProfile_tabFilter_options[];
}

export interface getPropLotProfile_propLotProfile_metadata {
  __typename: "PropLotResponseMetadata";
  requestUUID: string;
  appliedFilters: string[] | null;
}

export interface getPropLotProfile_propLotProfile {
  __typename: "PropLotProfileResponse";
  profile: getPropLotProfile_propLotProfile_profile;
  list: getPropLotProfile_propLotProfile_list[] | null;
  sortFilter: getPropLotProfile_propLotProfile_sortFilter | null;
  tabFilter: getPropLotProfile_propLotProfile_tabFilter | null;
  metadata: getPropLotProfile_propLotProfile_metadata;
}

export interface getPropLotProfile {
  propLotProfile: getPropLotProfile_propLotProfile;
}

export interface getPropLotProfileVariables {
  options: PropLotProfileInputOptions;
}
