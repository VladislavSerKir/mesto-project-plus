import { Router } from "express";
import {
  changeAvatar, editProfile, getUserById, getUser,
} from "../controllers/users";
import { maxAvatarLength, maxNameLength, minLength } from "../utils";

const { celebrate, Joi } = require('celebrate');

const userRouter = Router();

userRouter.get('/me', getUser);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(minLength).max(maxNameLength),
    about: Joi.string().required().min(minLength).max(maxAvatarLength),
  }),
}), editProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), changeAvatar);

export default userRouter;
