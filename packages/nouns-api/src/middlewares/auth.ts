import { verifyAccessToken } from "../utils/jwt";
import { Request, Response } from 'express';

const authMiddleware = async (req: Request, res: Response, next: any) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      message: 'Unauthorized: Auth Header missing'
    })
    return next()
  }

  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    res.status(401).json({
      message: 'Unauthorized: Access token is required'
    })
    return next()
  }
  await verifyAccessToken(token).then((user: any) => {
    console.log('USER', user)
    req.user = user
    next()
  }).catch (e => {
    next(e)
  })
}

export default authMiddleware