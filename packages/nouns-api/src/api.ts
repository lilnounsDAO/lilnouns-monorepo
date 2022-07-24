import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express, { Express, Request, Response } from 'express';
import AuthController from './controllers/auth';
import bodyParser from 'body-parser';
import IdeasController from './controllers/ideas';

import { PrismaClient } from '@prisma/client';
import authMiddleware from './middlewares/auth';

import Rollbar from 'rollbar';

export const prisma = new PrismaClient();

const cors = require('cors');

import { config } from './config';

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

  app.use(cors());

  app.use((req, res, next) => {
    Sentry.setUser({ ip_address: '{{auto}}' });
    next();
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

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
