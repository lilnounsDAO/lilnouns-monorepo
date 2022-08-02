import * as Sentry from '@sentry/node';

import { verifyAccessToken } from '../utils/jwt';
import { Request, Response } from 'express';

const authMiddleware = async (req: Request, res: Response, next: any) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({
        message: 'Unauthorized: Auth Header missing',
      })
      .end();
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token || token === 'undefined') {
    return res
      .status(401)
      .json({
        message: 'Unauthorized: Access token is required',
      })
      .end();
  }

  try {
    const user: any = await verifyAccessToken(token);
    req.user = user.payload;
    Sentry.setUser({ username: user.payload.wallet, ip_address: '{{auto}}' });
    next();
  } catch (e) {
    res
      .status(401)
      .json({
        message: 'Unauthorized: Failed to validate token',
      })
      .end();
  }
};

export default authMiddleware;
