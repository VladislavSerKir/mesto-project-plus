import { Router } from "express";
import {
  createCard, deleteCard, getCards, likeCard, removeLikeCard,
} from "../controllers/cards";
import validationNameLink from "../validation/nameLink";
import validationCardId from "../validation/cardId";

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', validationNameLink, createCard);

cardRouter.delete('/:cardId', validationCardId, deleteCard);

cardRouter.put('/:cardId/likes', validationCardId, likeCard);

cardRouter.delete('/:cardId/likes', validationCardId, removeLikeCard);

export default cardRouter;
