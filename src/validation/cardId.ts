import { idLength } from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(idLength).required(),
  }),
});
