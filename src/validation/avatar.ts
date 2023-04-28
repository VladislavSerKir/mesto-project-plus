import { urlPattern } from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(urlPattern)).required(),
  }),
});
