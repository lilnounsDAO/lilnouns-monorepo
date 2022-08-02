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

      // For local dev set NOUNS_TOKEN_ADDRESS to `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
      const lilnounCount = await nounTokenCount(fields.address);

      if (!(lilnounCount > 0)) {
        throw new Error(`User does not have a lil noun`);
      }

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

  static syncUserTokenCounts = async (req: Request, res: Response, next: any) => {
    try {
      if (!req.body?.to || !req.body?.from) {
        throw new Error(`No user data`);
      }
      await AuthService.syncUserTokenCounts(req.body);

      res.status(200).json({
        status: true,
        message: 'Update user token counts',
      });
    } catch (e: any) {
      return res
        .status(e.statusCode || 500)
        .json({
          message: e.message || 'Failed to update user token counts',
        })
        .end();
    }
  };
}

export default AuthController;
