import { Request, Response } from "express";
import { IError } from "../types";
import { ERROR_CODE_500, ERROR_MESSAGE_500 } from "../utils";

export default (err: IError, req: Request, res: Response) => {
  const { statusCode = ERROR_CODE_500, message = ERROR_MESSAGE_500 } = err;

  res.status(statusCode).send({ message });
};
