import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { CustomRequest, ICard, IError } from "../types";
import Card from "../models/card";
import {
  CODE_200,
  CODE_201,
} from "../utils";

const BadRequest400 = require('../errors/400');
const AuthorizationError401 = require('../errors/401');
const NotFound404 = require('../errors/404');

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  await Card.find({}).populate('owner').populate('likes')
    .then((cards: ICard) => {
      res.status(CODE_200).send(cards);
    })
    .catch((e: IError) => {
      next(e);
    });
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const customRequest = req as CustomRequest;

  const newCard = await Card.create({ name, link, owner: customRequest.user?._id });
  await newCard.populate('owner')
    .then((card: ICard) => {
      res.status(CODE_201).send(card);
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;

  Card.findOne({ _id: req.params.cardId })
    .then((card: ICard) => {
      if (!card) {
        throw new NotFound404();
      } else if (card.owner.toString() !== customRequest.user?._id) {
        throw new AuthorizationError401();
      } else {
        Card.deleteOne({ _id: req.params.cardId })
          .then((deletedCard: ICard) => res.status(CODE_200).send(deletedCard))
          .catch(next);
      }
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;
  const id = req.params.cardId;

  await Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: customRequest.user?._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((likedCard: ICard) => {
      res.status(CODE_200).send(likedCard);
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};

export const removeLikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const customRequest = req as CustomRequest;
  const id = req.params.cardId;

  await Card.findByIdAndUpdate(
    id,
    { $pull: { likes: customRequest.user?._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((likedCard: ICard) => {
      res.status(CODE_200).send(likedCard);
    })
    .catch((e: IError) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequest400());
      } else {
        next(e);
      }
    });
};
