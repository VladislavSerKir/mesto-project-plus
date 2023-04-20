import mongoose from "mongoose";
import { Request, Response } from "express";
import { CustomRequest } from "../types";
import Card from "../models/card";
import { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } from "../utils";
import User from "../models/user";

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    return res.status(500).send({ message: ERROR_CODE_500 });
  }
};


export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const customRequest = req as CustomRequest;
    const user = await User.findById(customRequest.user?._id);

    if (name && link && user) {
      const newCard = await Card.create(req.body);
      return res.status(201).send(newCard);
    }
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: ERROR_CODE_400 });
    }

    return res.status(500).send({ message: ERROR_CODE_500 });
  }
};


export const deleteCard = async (req: Request, res: Response) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (!cardToDelete) {
      return res.status(404).send({ message: ERROR_CODE_404 });
    }

    await Card.deleteOne({
      _id: req.params.cardId,
    });
    return res.status(200).send(cardToDelete);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: ERROR_CODE_400 });
    }

    return res.status(500).send({ message: ERROR_CODE_500 });
  }
};


export const likeCard = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(404).send({ message: ERROR_CODE_404 });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: customRequest.user?._id } },
      { new: true },
    );
    return res.status(200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: ERROR_CODE_400 });
    }

    return res.status(500).send({ message: ERROR_CODE_500 });
  }
};


export const removeLikeCard = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(404).send({ message: ERROR_CODE_404 });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: customRequest.user?._id } },
      { new: true },
    );
    return res.status(200).send(likedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: ERROR_CODE_400 });
    }

    return res.status(500).send({ message: ERROR_CODE_500 });
  }
};

export default {};
