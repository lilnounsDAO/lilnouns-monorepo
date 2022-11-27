/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FilterType {
  MULTI_SELECT = "MULTI_SELECT",
  SINGLE_SELECT = "SINGLE_SELECT",
}

export enum TagType {
  ARCHIVED = "ARCHIVED",
  CLOSED = "CLOSED",
  COMMUNITY = "COMMUNITY",
  CONSENSUS = "CONSENSUS",
  DISCUSSION = "DISCUSSION",
  GOVERNANCE = "GOVERNANCE",
  INFO = "INFO",
  NEW = "NEW",
  OTHER = "OTHER",
  QUORUM = "QUORUM",
  REQUEST = "REQUEST",
  SUGGESTION = "SUGGESTION",
}

export interface PropLotInputOptions {
  filters?: string[] | null;
  requestUUID: string;
}

export interface PropLotProfileInputOptions {
  filters?: string[] | null;
  wallet: string;
  requestUUID: string;
}

export interface SubmitVoteInputOptions {
  direction: number;
  ideaId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
