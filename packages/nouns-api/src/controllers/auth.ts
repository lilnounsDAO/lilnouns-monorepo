import { Request, Response } from 'express';

import AuthService from '../services/auth';
import { SiweMessage } from 'siwe';
import { nounTokenCount } from '../utils/utils';

class AuthController {
  static register = async (req: Request, res: Response, next: any) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(200).json({
        status: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (e: any) {
      return res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };
  static nonce = async (req: Request, res: Response, next: any) => {
    try {
      const requestedNonce = await AuthService.getNonce();
      res.status(200).json({
        status: true,
        message: 'Account login successful',
        data: { nonce: requestedNonce },
      });
    } catch (e: any) {
      return res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };

  static login = async (req: Request, res: Response, next: any) => {
    try {
      if (!req.body.message) {
        return res
          .status(422)
          .json({
            message: 'User does not have a lil noun',
          })
          .end();
      }

      const message = new SiweMessage(req.body.message);
      const fields = (await message.validate(req.body.signature)) as any;

      if (req.body.nonce !== fields.nonce) {
        return res.status(422).json({
          message: `Invalid nonce.`,
        });
      }

      // FIX BEFORE LAUNCH
      const lilnounCount = 2 || nounTokenCount(fields.address);

      // This isn't working but we want to run it to ensure the user has nouns before we auth them.

      // if (!lilNounsCount) {
      // console.log('Failed to fetch votes')
      // return next(new createError.Unauthorized(`User does not have a lil noun`))
      // }

      const data = await AuthService.login({ wallet: fields.address, lilnounCount });
      res.status(200).json({
        status: true,
        message: 'Account login successful',
        data,
      });
    } catch (e: any) {
      return res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };
  static all = async (req: Request, res: Response, next: any) => {
    try {
      const users = await AuthService.all();
      res.status(200).json({
        status: true,
        message: 'All users',
        data: users,
      });
    } catch (e: any) {
      return res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };
}

export default AuthController;
