import { Request, Response } from 'express';

import IdeasService from '../services/ideas';

class IdeasController {
  static getAllIdeas = async (req: Request, res: Response, next: any) => {
    try {
      const ideas = await IdeasService.all();
      res.status(200).json({
        status: true,
        message: 'All ideas',
        data: ideas,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static getIdeaById = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.get(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: 'All ideas',
        data: idea,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static createIdea = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.createIdea(req.body, req.user);

      res.status(200).json({
        status: true,
        message: 'Idea created',
        data: idea,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static voteOnIdea = async (req: Request, res: Response, next: any) => {
    try {
      const vote = await IdeasService.voteOnIdea(req.body, req.user);
      res.status(200).json({
        status: true,
        message: 'Voted on idea',
        data: vote,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static getCommentsByIdea = async (req: Request, res: Response, next: any) => {
    try {
      const comments = await IdeasService.getIdeaComments(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: 'Fetched comments',
        data: comments,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static commentOnIdea = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.commentOnIdea(req.body, req.user);
      res.status(200).json({
        status: true,
        message: 'Commented on idea',
        data: idea,
      });
    } catch (e: any) {
      next(e);
    }
  };

  static getVotesByIdea = async (req: Request, res: Response, next: any) => {
    try {
      const votes = await IdeasService.getVotesByIdea(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: 'Voted on idea',
        data: votes,
      });
    } catch (e: any) {
      next(e);
    }
  };
}

export default IdeasController;
