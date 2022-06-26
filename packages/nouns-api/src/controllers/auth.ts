import { Request, Response } from 'express';

import AuthService from '../services/auth';
import { SiweMessage } from 'siwe';

class AuthController {
  static register = async (req: Request, res: Response, next: any) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(200).json({
        status: true,
        message: 'User created successfully',
        data: user
      });
    }
    catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  }
  static nonce = async (req: Request, res: Response, next: any) => {
    const requestedNonce = await AuthService.getNonce();
    res.status(200).json({
      status: true,
      message: "Account login successful",
      data: { nonce: requestedNonce },
    })
  }

  static login = async (req: Request, res: Response, next: any) => {
    try {
      if (!req.body.message) {
        return res.status(422).json({
          message: 'User does not have a lil noun',
        });
      }

      const message = new SiweMessage(req.body.message);
      const fields = await message.validate(req.body.signature) as any;

      // This isn't working but we want to run it to ensure the user has nouns before we auth them.

      // if (!hasNounToken(fields.address)) {
        // console.log('Failed to fetch votes')
        // return next(new createError.Unauthorized(`User does not have a lil noun`))
      // }

      const data = await AuthService.login({ wallet: fields.address });
      res.status(200).json({
        status: true,
        message: "Account login successful",
        data
      });
    } catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  }
  static all = async (req: Request, res: Response, next: any) => {
    try {
      const users = await AuthService.all();
      res.status(200).json({
        status: true,
        message: 'All users',
        data: users
      });
    }
    catch (e: any) {
      res.status(e.statusCode).json({
        message: e.message,
      });
    }
  }
}

export default AuthController;