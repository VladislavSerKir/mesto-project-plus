import { Request, Response } from "express";
import { IError } from "../types";

export default (err: IError, req: Request, res: Response) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({ message });
};
