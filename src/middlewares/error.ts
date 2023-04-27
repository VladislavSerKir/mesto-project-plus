import { NextFunction, Request, Response } from "express";
import { ERROR_CODE_500, ERROR_MESSAGE_500 } from "../utils";
import { IError } from "../types";

export default (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ERROR_CODE_500, message = ERROR_MESSAGE_500 } = err;
  console.log(statusCode, message);
  res.status(statusCode).send({ message });
};
