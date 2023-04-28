import { Router } from "express";
import {
  changeAvatar, editProfile, getUserById, getUser,
} from "../controllers/users";
import validationUserCardId from "../validation/userCardId";
import validationNameAbout from "../validation/nameAbout";
import validationAvatar from "../validation/avatar";

const userRouter = Router();

userRouter.get('/me', getUser);

userRouter.get('/:userId', validationUserCardId, getUserById);

userRouter.patch('/me', validationNameAbout, editProfile);

userRouter.patch('/me/avatar', validationAvatar, changeAvatar);

export default userRouter;
