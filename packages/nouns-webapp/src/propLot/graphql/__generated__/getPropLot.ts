/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PropLotInputOptions, UIFilterType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPropLot
// ====================================================

export interface getPropLot_propLot_metadata_appliedFilters {
  __typename: "FilterParam";
  key: string;
  value: string;
}

export interface getPropLot_propLot_metadata {
  __typename: "PropLotResponseMetadata";
  requestUUID: string;
  appliedFilters: getPropLot_propLot_metadata_appliedFilters[] | null;
}

export interface getPropLot_propLot_sections_UIPropLotComponentList_list_data {
  __typename: "Idea";
  id: number;
  title: string;
  tldr: string;
  creatorId: string;
  description: string;
  votecount: number;
  createdAt: string;
}

export interface getPropLot_propLot_sections_UIPropLotComponentList_list {
  __typename: "UIIdeaRow";
  data: getPropLot_propLot_sections_UIPropLotComponentList_list_data;
}

export interface getPropLot_propLot_sections_UIPropLotComponentList {
  __typename: "UIPropLotComponentList";
  list: getPropLot_propLot_sections_UIPropLotComponentList_list[] | null;
}

export interface getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target_param {
  __typename: "FilterParam";
  key: string;
  value: string;
}

export interface getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target {
  __typename: "TargetFilterParam";
  param: getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target_param;
}

export interface getPropLot_propLot_sections_UIPropLotFilterBar_filters_options {
  __typename: "UIFilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  target: getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target;
}

export interface getPropLot_propLot_sections_UIPropLotFilterBar_filters {
  __typename: "UIFilter";
  id: string;
  type: UIFilterType;
  label: string | null;
  options: getPropLot_propLot_sections_UIPropLotFilterBar_filters_options[];
}

export interface getPropLot_propLot_sections_UIPropLotFilterBar {
  __typename: "UIPropLotFilterBar";
  filters: getPropLot_propLot_sections_UIPropLotFilterBar_filters[] | null;
}

export type getPropLot_propLot_sections = getPropLot_propLot_sections_UIPropLotComponentList | getPropLot_propLot_sections_UIPropLotFilterBar;

export interface getPropLot_propLot {
  __typename: "PropLotResponse";
  metadata: getPropLot_propLot_metadata;
  sections: getPropLot_propLot_sections[] | null;
}

export interface getPropLot {
  propLot: getPropLot_propLot;
}

export interface getPropLotVariables {
  options: PropLotInputOptions;
}
