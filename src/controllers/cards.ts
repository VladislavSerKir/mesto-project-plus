import mongoose from "mongoose";
import { Request, Response } from "express";
import { CustomRequest } from "../types";
import Card from "../models/card";

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name } = await req.body;

    if (!name) {
      throw new Error('Переданы не все поля');
    }

    const newCard = await Card.create(req.body);
    return res.status(201).send(newCard);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }

    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (!cardToDelete) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    await Card.deleteOne({
      _id: req.params.cardId,
    });
    return res.status(200).send(cardToDelete);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    if (!id) {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: customRequest.user?._id } },
      { new: true },
    );
    return res.status(200).send(likedCard);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export const removeLikeCard = async (req: Request, res: Response) => {
  try {
    const customRequest = req as CustomRequest;
    const id = req.params.cardId;

    if (!id) {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка.' });
    }

    const isCard = await Card.findById(req.params.cardId);

    if (!isCard) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }

    const likedCard = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: customRequest.user?._id } },
      { new: true },
    );
    return res.status(200).send(likedCard);
  } catch (e) {
    return res.status(500).send({ message: 'Ошибка сервера 500' });
  }
};

export default {};
