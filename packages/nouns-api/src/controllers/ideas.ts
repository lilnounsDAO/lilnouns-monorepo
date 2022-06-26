import { Request, Response } from 'express';

import IdeasService from '../services/ideas';

class IdeasController {
  static getAllIdeas = async (req: Request, res: Response, next: any) => {
    try {
      const ideas = await IdeasService.all();
      res.status(200).json({
        status: true,
        message: 'All ideas',
        data: ideas
      })
    }
    catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      })
    }
  }

  static createIdea = async (req: Request, res: Response, next: any) => {
    try {
      const ideas = await IdeasService.createIdea();
      res.status(200).json({
        status: true,
        message: 'Idea created',
        data: ideas
      })
    }
    catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      })
    }
  }
}

export default IdeasController;