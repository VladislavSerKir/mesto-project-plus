import { Router } from "express";
import {
  createCard, deleteCard, getCards, likeCard, removeLikeCard,
} from "../controllers/cards";

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', removeLikeCard);

export default cardRouter;
