import { Router } from "express";
import {
  createCard, deleteCard, getCards, likeCard, removeLikeCard,
} from "../controllers/cards";
import { idLength, maxNameLength, minLength } from "../utils";

const { celebrate, Joi } = require('celebrate');

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(minLength).max(maxNameLength),
    link: Joi.string().required(),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(idLength),
  }),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(idLength),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(idLength),
  }),
}), removeLikeCard);

export default cardRouter;
