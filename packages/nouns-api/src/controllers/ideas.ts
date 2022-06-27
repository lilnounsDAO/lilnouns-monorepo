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
      res.status(e.statusCode).json({
        message: e.message,
      });
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
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  };

  static createIdea = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.createIdea(req.body);
      res.status(200).json({
        status: true,
        message: 'Idea created',
        data: idea,
      });
    } catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  };

  static voteOnIdea = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.voteOnIdea(req.body);
      res.status(200).json({
        status: true,
        message: 'Voted on idea',
        data: idea,
      });
    } catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      });
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
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  };
}

export default IdeasController;
