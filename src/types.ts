import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IJwt extends JwtPayload {
  _id: string;
}

export interface CustomRequest extends Request {
  user?: IJwt
}

export interface IUser {
  name?: string,
  about?: string,
  avatar?: string,
  password: string,
  email: string,
  _id: string
}

export interface IError extends Error {
  statusCode: number,
  message: string,
  code?: number
}

export interface ICard {
  _id: string,
  name: string,
  link: string,
  owner: IUser,
  likes: Array<IUser>,
  createdAt: Date
}
