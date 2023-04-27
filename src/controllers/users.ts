import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user";
import { CustomRequest, IUser } from "../types";
import {
  CODE_200,
  CODE_201,
  ERROR_MESSAGE_409,
  weekLength,
} from "../utils";

const bcrypt = require('bcrypt');

const BadRequest400 = require('../errors/400');
const AuthorizationError401 = require('../errors/401');
const NotFound404 = require('../errors/404');
const Conflict409 = require('../errors/409');

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user);

    return res.status(CODE_200).send(user);
  } catch (e) {
    return next(e);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFound404();
    }

    return res.status(CODE_200).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      throw new BadRequest400();
    }

    return next(e);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    return await bcrypt.hash(password, 10)
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
      });
  } catch (e: any) {
    if (e instanceof mongoose.Error.ValidationError) {
      throw new BadRequest400();
    } else if (e.code === 11000) {
      throw new Conflict409(ERROR_MESSAGE_409);
    }

    return next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    return await User.findUserByCredentials(email, password)
      .then((user: IUser) => {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: weekLength });
        res.cookie('token', token, { httpOnly: true });
        res.send({ token });
      })
      .catch(() => {
        throw new AuthorizationError401();
      });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      throw new BadRequest400();
    }

    return next(e);
  }
};

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    const { name, about } = req.body;

    if (!user) {
      throw new NotFound404();
    }

    Object.assign(user, { name, about });
    await user.save();
    return res.status(CODE_201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      throw new BadRequest400();
    }

    return next(e);
  }
};

export const changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;

    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user);

    if (!user) {
      throw new NotFound404();
    }

    Object.assign(user, { avatar });
    await user.save();
    return res.status(CODE_201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new BadRequest400());
    }

    return next(e);
  }
};

export default {};
