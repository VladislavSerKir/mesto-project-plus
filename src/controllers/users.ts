import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user";
import { CustomRequest } from "../types";
import {
  CODE_200,
  CODE_201,
  ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, ERROR_MESSAGE_400, ERROR_MESSAGE_404,
  ERROR_MESSAGE_500,
} from "../utils";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(CODE_200).send(users);
  } catch (e) {
    return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    return res.status(CODE_200).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
    }

    return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });
    return res.status(CODE_201).send(newUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
    }

    return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);
    const { name, about } = req.body;

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    Object.assign(user, { name, about });
    await user.save();
    return res.status(201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
    }

    return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export const changeAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;

    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    Object.assign(user, { avatar });
    await user.save();
    return res.status(CODE_201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
    }

    return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export default {};
