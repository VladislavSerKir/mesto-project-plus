import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest, IJwt } from '../types';
import { ERROR_CODE_401, ERROR_MESSAGE_401 } from '../utils';

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(ERROR_CODE_401).send({ message: ERROR_MESSAGE_401 });
  }

  req.user = payload as IJwt;

  return next();
};
