import { IResolvers } from '@graphql-tools/utils';
import IdeaResolvers from './resolvers/IdeaResolvers';
import UserResolvers from './resolvers/UserResolvers';
import { mergeDeep } from '@graphql-tools/utils';

const resolverMap: IResolvers = mergeDeep([IdeaResolvers, UserResolvers]);
export default resolverMap;
