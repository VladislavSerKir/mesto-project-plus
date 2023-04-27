import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user";
import { CustomRequest, IUser } from "../types";
import {
  CODE_200,
  CODE_201,
  ERROR_CODE_400, ERROR_CODE_401, ERROR_CODE_404, ERROR_CODE_500, ERROR_MESSAGE_400,
  ERROR_MESSAGE_401, ERROR_MESSAGE_404,
  ERROR_MESSAGE_500,
} from "../utils";

const bcrypt = require('bcrypt');

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user);
    // console.log(customRequest.user?._id);

    return res.status(CODE_200).send(user);
  } catch (e) {
    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    return res.status(CODE_200).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
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
      .then((user: IUser) => res.status(CODE_201).send({ user }))
      .catch(() => res.status(ERROR_CODE_400).send(ERROR_MESSAGE_400));
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    return await User.findUserByCredentials(email, password)
      .then((user: IUser) => {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '3m' });
        res.cookie('token', token, { httpOnly: true });
        res.send({ token });
      })
      .catch((e) =>
        // res.status(ERROR_CODE_401).send(ERROR_MESSAGE_401);
        next(e));
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    const { name, about } = req.body;

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    Object.assign(user, { name, about });
    await user.save();
    return res.status(CODE_201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;

    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user);

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    Object.assign(user, { avatar });
    await user.save();
    return res.status(CODE_201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export default {};
