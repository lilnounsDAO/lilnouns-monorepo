import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express, { Express, Request, Response } from 'express';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import AuthController from './controllers/auth';
import bodyParser from 'body-parser';
import IdeasController from './controllers/ideas';

import { PrismaClient } from '@prisma/client';
import { authMiddleware, apolloAuthScope } from './middlewares/auth';

import cors from 'cors';

import Rollbar from 'rollbar';

export const prisma = new PrismaClient();

import { config } from './config';

import schema from './graphql/schemasMap';

export const rollbar = new Rollbar({
  accessToken: config.rollbarApiKey,
  captureUncaught: true,
  captureUnhandledRejections: true,
  autoInstrument: true,
  environment: config.environment,
  enabled: Boolean(config.rollbarApiKey),
});

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();

  async function startApolloServer() {
    const apolloServer = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      introspection: true,
      context: async ({ req }) => {
        return {
          authScope: await apolloAuthScope(req.headers.authorization),
          timeZone: req.headers['proplot-tz'] || 'UTC',
        };
      },
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
  }

  Sentry.init({
    dsn: config.sentryDSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
      new Tracing.Integrations.Prisma({ client: prisma }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.75,
  });

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(
    cors({
      origin: [
        'https://lambent-melba-6dd07a.netlify.app',
        'https://eloquent-sunshine-5116fa.netlify.app',
        'https://master--frosty-hugle-07297b.netlify.app',
        'https://staging--frosty-hugle-07297b.netlify.app',
        'https://production--frosty-hugle-07297b.netlify.app',
        'https://lilnouns.wtf',
        ...(config.environment === 'development' ? ['http://localhost:3000'] : []),
      ],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200,
      credentials: true,
      allowedHeaders: [
        '*',
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
        'proplot-tz',
      ],
    }),
  );

  app.use((req, res, next) => {
    Sentry.setUser({ ip_address: '{{auto}}' });
    next();
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  startApolloServer();

  app.get('/', (_req, res) => {
    res.status(200).send({
      message: 'Nouns API Root',
    });
  });

  app.get('/nonce', AuthController.nonce);
  app.post('/login', AuthController.login);
  app.get('/idea/:id', IdeasController.getIdeaById);
  app.get('/idea/:id/comments', IdeasController.getCommentsByIdea);
  app.get('/idea/:id/votes', IdeasController.getVotesByIdea);
  app.post('/idea/:id/comments', authMiddleware, IdeasController.commentOnIdea);
  app.post('/idea/vote', authMiddleware, IdeasController.voteOnIdea);
  app.get('/ideas', IdeasController.getAllIdeas);
  app.post('/ideas', authMiddleware, IdeasController.createIdea);
  app.post('/token-transfer', authMiddleware, AuthController.syncUserTokenCounts);

  app.use(rollbar.errorHandler());
  app.use((err: any, req: Request, res: Response, next: any) => {
    return res
      .status(err.status || 500)
      .json({
        status: false,
        message: err.message,
      })
      .end();
  });

  return app;
};
