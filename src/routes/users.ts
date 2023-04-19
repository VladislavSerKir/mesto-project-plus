import { Router } from "express";
import {
  changeAvatar, createUser, editProfile, getUserById, getUsers,
} from "../controllers/users";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', editProfile);
userRouter.patch('/me/avatar', changeAvatar);

export default userRouter;
