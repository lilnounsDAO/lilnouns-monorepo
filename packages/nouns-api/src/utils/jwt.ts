import jwt from 'jsonwebtoken';
import { config } from '../config';

const signAccessToken = (payload: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, config.lilNounsJWTSecret as string, {}, (err: any, token: any) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.lilNounsJWTSecret as string, (err: any, payload: any) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
};

export { signAccessToken, verifyAccessToken }
