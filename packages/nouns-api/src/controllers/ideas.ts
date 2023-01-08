import { Request, Response } from 'express';

import { prisma } from '../api';
import IdeasService from '../services/ideas';

class IdeasController {
  static getAllIdeas = async (req: Request, res: Response, next: any) => {
    try {
      const ideas = await IdeasService.all({ sortBy: req.query.sort as string });
      res.status(200).json({
        status: true,
        message: 'All ideas',
        data: ideas,
      });
    } catch (e: any) {
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };

  static getIdeaById = async (req: Request, res: Response, next: any) => {
    try {
      const idea = await IdeasService.get(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: `Idea ${req.params.id}`,
        data: idea,
      });
    } catch (e: any) {
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
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
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
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
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
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
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
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
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
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
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };

  static deleteComment = async (req: Request, res: Response, next: any) => {
    try {
      const address = req.user?.wallet;

      if (!address) {
        res
          .status(500)
          .json({
            message: 'You must be logged in to delete a comment.',
          })
          .end();
      }

      const comment = await prisma.comment.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (comment?.authorId !== address) {
        res
          .status(500)
          .json({
            message: 'You must be the owner of the comment to delete it.',
          })
          .end();
      }
      const deletedComment = await IdeasService.deleteComment(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: 'Comment deleted',
        data: deletedComment,
      });
    } catch (e: any) {
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };

  static deleteIdea = async (req: Request, res: Response, next: any) => {
    try {
      const address = req.user?.wallet;

      if (!address) {
        res
          .status(500)
          .json({
            message: 'You must be logged in to delete an idea.',
          })
          .end();
      }

      const idea = await prisma.idea.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (idea?.creatorId !== address) {
        res
          .status(500)
          .json({
            message: 'You must be the owner of the idea to delete it.',
          })
          .end();
      }

      const deletedIdea = await IdeasService.deleteIdea(parseInt(req.params.id));
      res.status(200).json({
        status: true,
        message: 'Idea deleted',
        data: deletedIdea,
      });
    } catch (e: any) {
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };
}

export default IdeasController;
