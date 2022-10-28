import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import config from '../../config';

import dotenv from 'dotenv';
dotenv.config();

const propLotLink = new HttpLink({
  uri: config.app.nounsApiUri + '/graphql',
});

//pass them to apollo-client config
const propLotClient = new ApolloClient({
  link: propLotLink,
  cache: new InMemoryCache(),
});

export default propLotClient;
