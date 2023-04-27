import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types";
import Card from "../models/card";
import {
  CODE_200,
  CODE_201,
  ERROR_CODE_400, ERROR_CODE_401, ERROR_CODE_404, ERROR_CODE_500, ERROR_MESSAGE_400,
  ERROR_MESSAGE_401, ERROR_MESSAGE_404,
  ERROR_MESSAGE_500,
} from "../utils";

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(CODE_200).send(cards);
  } catch (e) {
    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const customRequest = req as CustomRequest;

    const newCard = await Card.create({ name, link, owner: customRequest.user?._id });

    return res.status(CODE_201).send(newCard);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    return next(e);
    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
  }
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (!cardToDelete) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    const customRequest = req as CustomRequest;
    // console.log(cardToDelete.owner.toString(), customRequest.user?._id);
    if (cardToDelete.owner.toString() !== customRequest.user?._id) {
      return res.status(ERROR_CODE_401).send({ message: ERROR_MESSAGE_401 });
    }

    await Card.deleteOne({
      _id: req.params.cardId,
    });
    return res.status(CODE_200).send(cardToDelete);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: customRequest.user?._id } },

      { new: true },
    );
    return res.status(CODE_200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export const removeLikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customRequest = req as CustomRequest;

    const id = req.params.cardId;

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: customRequest.user?._id } },
      { new: true },
    );
    return res.status(CODE_200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      // return res.status(ERROR_CODE_400).send({ message: ERROR_MESSAGE_400 });
      return next(e);
    }

    // return res.status(ERROR_CODE_500).send({ message: ERROR_MESSAGE_500 });
    return next(e);
  }
};

export default {};
