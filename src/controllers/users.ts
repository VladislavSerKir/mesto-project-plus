import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user";
import { CustomRequest, IError, IUser } from "../types";
import {
  CODE_200,
  CODE_201,
  ERROR_MESSAGE_409,
  weekLength,
} from "../utils";

const bcrypt = require('bcrypt');

const BadRequest400 = require('../errors/400');
const NotFound404 = require('../errors/404');
const Conflict409 = require('../errors/409');

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;
  await User.findById(customRequest.user)
    .then((user: IUser) => {
      res.status(CODE_200).send(user);
    })
    .catch((e: IError) => {
      next(e);
    });
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  await User.findById(userId)
    .then((user: IUser) => {
      if (!user) {
        throw new NotFound404();
      } else {
        res.status(CODE_200).send(user);
      }
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then(async (hash: string) => {
      await User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user: IUser) => {
      res.status(CODE_201).send({ user: user.name, email: user.email });
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequest400());
      } else if (e.code === 11000) {
        next(new Conflict409(ERROR_MESSAGE_409));
      } else {
        next(e);
      }
    });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user: IUser) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: weekLength });
      res.cookie('token', token, { httpOnly: true });
      res.end();
    })
    .catch(next);
};

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;

  await User.findById(customRequest.user)
    .then((user: IUser) => {
      if (!user) {
        throw new NotFound404();
      } else {
        const { name, about } = req.body;
        Object.assign(user, { name, about });
        res.status(CODE_201).send(user);
      }
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};

export const changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  const customRequest = req as CustomRequest;
  await User.findById(customRequest.user)
    .then((user: IUser) => {
      if (!user) {
        throw new NotFound404();
      } else {
        Object.assign(user, { avatar });
        res.status(CODE_201).send(user);
      }
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};
