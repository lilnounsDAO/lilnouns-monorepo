import * as Sentry from '@sentry/node';

import { verifyAccessToken } from '../utils/jwt';
import { Request, Response } from 'express';

// REST API auth middleware
export const authMiddleware = async (req: Request, res: Response, next: any) => {
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

// GraphQL server auth scope. Parse auth token and add it to the context property. Can be used in resolvers to authenticate queries.
export const apolloAuthScope = async (authHeader: string | undefined) => {
  if (!authHeader) {
    return {
      isAuthorized: false,
      user: undefined,
      error: {
        status: 401,
        message: 'Unauthorized: Auth Header missing',
      }
    }
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === 'undefined') {
    return {
      isAuthorized: false,
      user: undefined,
      error: {
        status: 401,
        message: 'Unauthorized: Access Token missing',
      }
    }
  }

  try {
    const user: any = await verifyAccessToken(token);
    Sentry.setUser({ username: user.payload.wallet, ip_address: '{{auto}}' });
    return {
      isAuthorized: true,
      user: user.payload,
      error: undefined
    }
  } catch (e) {
    return {
      isAuthorized: false,
      user: undefined,
      error: {
        status: 401,
        message: 'Unauthorized: Failed to validate token',
      }
    }
  }
}
