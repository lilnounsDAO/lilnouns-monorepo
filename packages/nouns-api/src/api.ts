import express, { Express, Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { getTokenMetadata } from './utils/utils';

import { nounsTokenContract } from './clients';

import AuthController from './controllers/auth';
import bodyParser from 'body-parser';
import IdeasController from './controllers/ideas';

import { PrismaClient } from '@prisma/client';
import authMiddleware from './middlewares/auth';

export const prisma = new PrismaClient();

const cors = require('cors');

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();
  app.use(express.json());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cors());

  app.use((err: any, req: Request, res: Response, next: any) => {
    res
      .status(err.status || 500)
      .json({
        status: false,
        message: err.message,
      })
      .end();
  });

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

  return app;
};
