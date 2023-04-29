import { maxNameLength, minLength, urlPattern } from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(minLength).max(maxNameLength),
    link: Joi.string().pattern(new RegExp(urlPattern)).required(),
  }),
});
