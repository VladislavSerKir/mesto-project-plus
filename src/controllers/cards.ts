import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types";
import Card from "../models/card";
import {
  CODE_200,
  CODE_201,
} from "../utils";

const BadRequest400 = require('../errors/400');
const AuthorizationError401 = require('../errors/401');
const NotFound404 = require('../errors/404');

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate('owner').populate('likes');

    return res.status(CODE_200).send(cards);
  } catch (e) {
    return next(e);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const customRequest = req as CustomRequest;

    const newCard = await Card.create({ name, link, owner: customRequest.user?._id });
    await newCard.populate('owner');

    return res.status(CODE_201).send(newCard);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest400());
    }

    return next(e);
  }
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (!cardToDelete) {
      throw new NotFound404();
    }

    const customRequest = req as CustomRequest;
    if (cardToDelete.owner.toString() !== customRequest.user?._id) {
      throw new AuthorizationError401();
    }

    await Card.deleteOne({
      _id: req.params.cardId,
    });
    await cardToDelete.populate('owner').populate('likes');
    return res.status(CODE_200).send(cardToDelete);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return next(new BadRequest400());
    }

    return next(e);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: customRequest.user?._id } },

      { new: true },
    )
      .populate('owner')
      .populate('likes');
    return res.status(CODE_200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return next(new BadRequest400());
    }

    return next(e);
  }
};

export const removeLikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;

    const id = req.params.cardId;

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: customRequest.user?._id } },
      { new: true },
    )
      .populate('owner')
      .populate('likes');
    return res.status(CODE_200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return next(new BadRequest400());
    }

    return next(e);
  }
};

export default {};
