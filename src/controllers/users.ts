import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user";
import { CustomRequest } from "../types";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: e.message });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    }

    return res.status(200).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: e.message });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about } = await req.body;

    if (!name || !about) {
      throw new Error('Переданы не все поля для создания пользователя');
    }

    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
    }

    Object.assign(user, req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const changeAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = await req.body;

    if (!avatar) {
      throw new Error('Переданы не все поля для редактирования аватара');
    }
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
    }

    Object.assign(user, req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export default {};
