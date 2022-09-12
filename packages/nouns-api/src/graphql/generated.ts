import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  authorId: Scalars['String'];
  body: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  ideaId: Scalars['Int'];
  parentId?: Maybe<Scalars['Int']>;
  replies?: Maybe<Array<Comment>>;
};

export type FilterInput = {
  id: Scalars['String'];
  value: Scalars['String'];
};

export type FilterParam = {
  __typename?: 'FilterParam';
  id: Scalars['String'];
  value: Scalars['String'];
};

export type Idea = {
  __typename?: 'Idea';
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['String'];
  creatorId: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  ideaStats?: Maybe<IdeaStats>;
  tags?: Maybe<Array<IdeaTags>>;
  title: Scalars['String'];
  tldr: Scalars['String'];
  votecount: Scalars['Int'];
  votes?: Maybe<Array<Vote>>;
};

export type IdeaInputOptions = {
  sort?: InputMaybe<Sort_Type>;
};

export type IdeaStats = {
  __typename?: 'IdeaStats';
  comments?: Maybe<Scalars['Int']>;
};

export type IdeaTags = {
  __typename?: 'IdeaTags';
  label: Scalars['String'];
  type: TagType;
};

export type PropLotInputOptions = {
  filters?: InputMaybe<Array<FilterInput>>;
  requestUUID: Scalars['String'];
  wallet?: InputMaybe<Scalars['String']>;
};

export type PropLotListResponse = {
  __typename?: 'PropLotListResponse';
  list?: Maybe<Array<UiListItem>>;
  metadata: PropLotListResponseMetadata;
  uiFilters?: Maybe<UiFilterGroup>;
};

export type PropLotListResponseMetadata = {
  __typename?: 'PropLotListResponseMetadata';
  appliedFilters?: Maybe<Array<FilterParam>>;
  requestUUID: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAllUsers?: Maybe<Array<User>>;
  getIdeas?: Maybe<Array<Idea>>;
  getPropLotList: PropLotListResponse;
  getUser?: Maybe<User>;
};


export type QueryGetIdeasArgs = {
  options: IdeaInputOptions;
};


export type QueryGetPropLotListArgs = {
  options: PropLotInputOptions;
};


export type QueryGetUserArgs = {
  options: UserInputOptions;
};

export enum Sort_Type {
  Latest = 'LATEST',
  Oldest = 'OLDEST',
  VotesAsc = 'VOTES_ASC',
  VotesDesc = 'VOTES_DESC'
}

export enum TagType {
  Archived = 'ARCHIVED',
  Discussion = 'DISCUSSION',
  Info = 'INFO',
  New = 'NEW',
  Quorum = 'QUORUM'
}

export type Target = TargetAction | TargetFilterParam;

export type TargetAction = {
  __typename?: 'TargetAction';
  action: TargetActionType;
  displayName: Scalars['String'];
};

export enum TargetActionType {
  ArchiveIdea = 'ARCHIVE_IDEA'
}

export type TargetFilterParam = {
  __typename?: 'TargetFilterParam';
  param: FilterParam;
};

export type UiDropdownFilter = {
  __typename?: 'UIDropdownFilter';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options: Array<UiFilterOption>;
  type: UiFilterType;
};

export type UiDropdownPill = {
  __typename?: 'UIDropdownPill';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options: Array<UiFilterOption>;
  selected: Scalars['Boolean'];
};

export type UiFilterGroup = {
  __typename?: 'UIFilterGroup';
  filterDropdown?: Maybe<UiDropdownFilter>;
  filterPills?: Maybe<UiFilterPillGroup>;
  sortPills?: Maybe<UiSortPillGroup>;
};

export type UiFilterOption = {
  __typename?: 'UIFilterOption';
  id: Scalars['String'];
  label: Scalars['String'];
  selected: Scalars['Boolean'];
  target: TargetFilterParam;
};

export type UiFilterPillGroup = {
  __typename?: 'UIFilterPillGroup';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  pills: Array<UiFilterPills>;
  type: UiFilterType;
};

export type UiFilterPills = UiDropdownPill | UiTogglePill;

export enum UiFilterType {
  MultiSelect = 'MULTI_SELECT',
  SingleSelect = 'SINGLE_SELECT'
}

export type UiIdeaRow = {
  __typename?: 'UIIdeaRow';
  actionMenu?: Maybe<Array<TargetAction>>;
  data: Idea;
};

export type UiListItem = UiIdeaRow;

export type UiSortPillGroup = {
  __typename?: 'UISortPillGroup';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  pills: Array<UiFilterPills>;
};

export type UiTogglePill = {
  __typename?: 'UITogglePill';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options: Array<UiFilterOption>;
};

export type User = {
  __typename?: 'User';
  userStats?: Maybe<UserStats>;
  wallet: Scalars['String'];
};

export type UserInputOptions = {
  wallet: Scalars['String'];
};

export type UserStats = {
  __typename?: 'UserStats';
  totalComments?: Maybe<Scalars['Int']>;
  totalIdeas?: Maybe<Scalars['Int']>;
  totalVotes?: Maybe<Scalars['Int']>;
};

export type Vote = {
  __typename?: 'Vote';
  direction: Scalars['Int'];
  id: Scalars['Int'];
  ideaId: Scalars['Int'];
  voter: User;
  voterId: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<Comment>;
  FilterInput: FilterInput;
  FilterParam: ResolverTypeWrapper<FilterParam>;
  Idea: ResolverTypeWrapper<Idea>;
  IdeaInputOptions: IdeaInputOptions;
  IdeaStats: ResolverTypeWrapper<IdeaStats>;
  IdeaTags: ResolverTypeWrapper<IdeaTags>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PropLotInputOptions: PropLotInputOptions;
  PropLotListResponse: ResolverTypeWrapper<Omit<PropLotListResponse, 'list'> & { list?: Maybe<Array<ResolversTypes['UIListItem']>> }>;
  PropLotListResponseMetadata: ResolverTypeWrapper<PropLotListResponseMetadata>;
  Query: ResolverTypeWrapper<{}>;
  SORT_TYPE: Sort_Type;
  String: ResolverTypeWrapper<Scalars['String']>;
  TagType: TagType;
  Target: ResolversTypes['TargetAction'] | ResolversTypes['TargetFilterParam'];
  TargetAction: ResolverTypeWrapper<TargetAction>;
  TargetActionType: TargetActionType;
  TargetFilterParam: ResolverTypeWrapper<TargetFilterParam>;
  UIDropdownFilter: ResolverTypeWrapper<UiDropdownFilter>;
  UIDropdownPill: ResolverTypeWrapper<UiDropdownPill>;
  UIFilterGroup: ResolverTypeWrapper<UiFilterGroup>;
  UIFilterOption: ResolverTypeWrapper<UiFilterOption>;
  UIFilterPillGroup: ResolverTypeWrapper<Omit<UiFilterPillGroup, 'pills'> & { pills: Array<ResolversTypes['UIFilterPills']> }>;
  UIFilterPills: ResolversTypes['UIDropdownPill'] | ResolversTypes['UITogglePill'];
  UIFilterType: UiFilterType;
  UIIdeaRow: ResolverTypeWrapper<UiIdeaRow>;
  UIListItem: ResolversTypes['UIIdeaRow'];
  UISortPillGroup: ResolverTypeWrapper<Omit<UiSortPillGroup, 'pills'> & { pills: Array<ResolversTypes['UIFilterPills']> }>;
  UITogglePill: ResolverTypeWrapper<UiTogglePill>;
  User: ResolverTypeWrapper<User>;
  UserInputOptions: UserInputOptions;
  UserStats: ResolverTypeWrapper<UserStats>;
  Vote: ResolverTypeWrapper<Vote>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Comment: Comment;
  FilterInput: FilterInput;
  FilterParam: FilterParam;
  Idea: Idea;
  IdeaInputOptions: IdeaInputOptions;
  IdeaStats: IdeaStats;
  IdeaTags: IdeaTags;
  Int: Scalars['Int'];
  PropLotInputOptions: PropLotInputOptions;
  PropLotListResponse: Omit<PropLotListResponse, 'list'> & { list?: Maybe<Array<ResolversParentTypes['UIListItem']>> };
  PropLotListResponseMetadata: PropLotListResponseMetadata;
  Query: {};
  String: Scalars['String'];
  Target: ResolversParentTypes['TargetAction'] | ResolversParentTypes['TargetFilterParam'];
  TargetAction: TargetAction;
  TargetFilterParam: TargetFilterParam;
  UIDropdownFilter: UiDropdownFilter;
  UIDropdownPill: UiDropdownPill;
  UIFilterGroup: UiFilterGroup;
  UIFilterOption: UiFilterOption;
  UIFilterPillGroup: Omit<UiFilterPillGroup, 'pills'> & { pills: Array<ResolversParentTypes['UIFilterPills']> };
  UIFilterPills: ResolversParentTypes['UIDropdownPill'] | ResolversParentTypes['UITogglePill'];
  UIIdeaRow: UiIdeaRow;
  UIListItem: ResolversParentTypes['UIIdeaRow'];
  UISortPillGroup: Omit<UiSortPillGroup, 'pills'> & { pills: Array<ResolversParentTypes['UIFilterPills']> };
  UITogglePill: UiTogglePill;
  User: User;
  UserInputOptions: UserInputOptions;
  UserStats: UserStats;
  Vote: Vote;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  authorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ideaId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterParamResolvers<ContextType = any, ParentType extends ResolversParentTypes['FilterParam'] = ResolversParentTypes['FilterParam']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdeaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Idea'] = ResolversParentTypes['Idea']> = {
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ideaStats?: Resolver<Maybe<ResolversTypes['IdeaStats']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['IdeaTags']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tldr?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votecount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<ResolversTypes['Vote']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdeaStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['IdeaStats'] = ResolversParentTypes['IdeaStats']> = {
  comments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdeaTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['IdeaTags'] = ResolversParentTypes['IdeaTags']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TagType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PropLotListResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PropLotListResponse'] = ResolversParentTypes['PropLotListResponse']> = {
  list?: Resolver<Maybe<Array<ResolversTypes['UIListItem']>>, ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['PropLotListResponseMetadata'], ParentType, ContextType>;
  uiFilters?: Resolver<Maybe<ResolversTypes['UIFilterGroup']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PropLotListResponseMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['PropLotListResponseMetadata'] = ResolversParentTypes['PropLotListResponseMetadata']> = {
  appliedFilters?: Resolver<Maybe<Array<ResolversTypes['FilterParam']>>, ParentType, ContextType>;
  requestUUID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllUsers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  getIdeas?: Resolver<Maybe<Array<ResolversTypes['Idea']>>, ParentType, ContextType, RequireFields<QueryGetIdeasArgs, 'options'>>;
  getPropLotList?: Resolver<ResolversTypes['PropLotListResponse'], ParentType, ContextType, RequireFields<QueryGetPropLotListArgs, 'options'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'options'>>;
};

export type TargetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Target'] = ResolversParentTypes['Target']> = {
  __resolveType: TypeResolveFn<'TargetAction' | 'TargetFilterParam', ParentType, ContextType>;
};

export type TargetActionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TargetAction'] = ResolversParentTypes['TargetAction']> = {
  action?: Resolver<ResolversTypes['TargetActionType'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TargetFilterParamResolvers<ContextType = any, ParentType extends ResolversParentTypes['TargetFilterParam'] = ResolversParentTypes['TargetFilterParam']> = {
  param?: Resolver<ResolversTypes['FilterParam'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiDropdownFilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIDropdownFilter'] = ResolversParentTypes['UIDropdownFilter']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['UIFilterOption']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['UIFilterType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiDropdownPillResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIDropdownPill'] = ResolversParentTypes['UIDropdownPill']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['UIFilterOption']>, ParentType, ContextType>;
  selected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiFilterGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIFilterGroup'] = ResolversParentTypes['UIFilterGroup']> = {
  filterDropdown?: Resolver<Maybe<ResolversTypes['UIDropdownFilter']>, ParentType, ContextType>;
  filterPills?: Resolver<Maybe<ResolversTypes['UIFilterPillGroup']>, ParentType, ContextType>;
  sortPills?: Resolver<Maybe<ResolversTypes['UISortPillGroup']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiFilterOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIFilterOption'] = ResolversParentTypes['UIFilterOption']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  selected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['TargetFilterParam'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiFilterPillGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIFilterPillGroup'] = ResolversParentTypes['UIFilterPillGroup']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pills?: Resolver<Array<ResolversTypes['UIFilterPills']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['UIFilterType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiFilterPillsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIFilterPills'] = ResolversParentTypes['UIFilterPills']> = {
  __resolveType: TypeResolveFn<'UIDropdownPill' | 'UITogglePill', ParentType, ContextType>;
};

export type UiIdeaRowResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIIdeaRow'] = ResolversParentTypes['UIIdeaRow']> = {
  actionMenu?: Resolver<Maybe<Array<ResolversTypes['TargetAction']>>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['Idea'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiListItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['UIListItem'] = ResolversParentTypes['UIListItem']> = {
  __resolveType: TypeResolveFn<'UIIdeaRow', ParentType, ContextType>;
};

export type UiSortPillGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['UISortPillGroup'] = ResolversParentTypes['UISortPillGroup']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pills?: Resolver<Array<ResolversTypes['UIFilterPills']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiTogglePillResolvers<ContextType = any, ParentType extends ResolversParentTypes['UITogglePill'] = ResolversParentTypes['UITogglePill']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['UIFilterOption']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  userStats?: Resolver<Maybe<ResolversTypes['UserStats']>, ParentType, ContextType>;
  wallet?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStats'] = ResolversParentTypes['UserStats']> = {
  totalComments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalIdeas?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalVotes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  direction?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ideaId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  voter?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  voterId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  FilterParam?: FilterParamResolvers<ContextType>;
  Idea?: IdeaResolvers<ContextType>;
  IdeaStats?: IdeaStatsResolvers<ContextType>;
  IdeaTags?: IdeaTagsResolvers<ContextType>;
  PropLotListResponse?: PropLotListResponseResolvers<ContextType>;
  PropLotListResponseMetadata?: PropLotListResponseMetadataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Target?: TargetResolvers<ContextType>;
  TargetAction?: TargetActionResolvers<ContextType>;
  TargetFilterParam?: TargetFilterParamResolvers<ContextType>;
  UIDropdownFilter?: UiDropdownFilterResolvers<ContextType>;
  UIDropdownPill?: UiDropdownPillResolvers<ContextType>;
  UIFilterGroup?: UiFilterGroupResolvers<ContextType>;
  UIFilterOption?: UiFilterOptionResolvers<ContextType>;
  UIFilterPillGroup?: UiFilterPillGroupResolvers<ContextType>;
  UIFilterPills?: UiFilterPillsResolvers<ContextType>;
  UIIdeaRow?: UiIdeaRowResolvers<ContextType>;
  UIListItem?: UiListItemResolvers<ContextType>;
  UISortPillGroup?: UiSortPillGroupResolvers<ContextType>;
  UITogglePill?: UiTogglePillResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserStats?: UserStatsResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
};

