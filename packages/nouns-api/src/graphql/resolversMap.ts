import { IResolvers } from '@graphql-tools/utils';
import IdeaResolvers from './resolvers/IdeaResolvers';
import PropLotListResolvers from './resolvers/PropLotListResolvers';
import UserResolvers from './resolvers/UserResolvers';
import { mergeDeep } from '@graphql-tools/utils';

const resolverMap: IResolvers = mergeDeep([IdeaResolvers, UserResolvers, PropLotListResolvers]);
export default resolverMap;
