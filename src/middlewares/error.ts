import { Request, Response } from "express";
import { IError } from "../types";
import { ERROR_CODE_500, ERROR_MESSAGE_500 } from "../utils";

export default (err: IError, req: Request, res: Response) => {
  const { statusCode, message } = err;

  if (statusCode === ERROR_CODE_500) {
    res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }

  res.status(statusCode).send({ message });
};
