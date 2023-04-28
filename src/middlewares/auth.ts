import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest, IJwt } from '../types';

const AuthorizationError401 = require('../errors/401');

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  let payload;

  try {
    if (!token) {
      return next(new AuthorizationError401());
    }
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError401());
  }

  req.user = payload as IJwt;

  return next();
};
