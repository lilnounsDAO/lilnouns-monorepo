/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FilterType } from "./globalTypes";

// ====================================================
// GraphQL fragment: filterProperties
// ====================================================

export interface filterProperties_options {
  __typename: "FilterOption";
  id: string;
  label: string | null;
  selected: boolean;
  value: string;
  icon: string | null;
}

export interface filterProperties {
  __typename: "PropLotFilter";
  id: string;
  type: FilterType;
  label: string | null;
  options: filterProperties_options[];
}
