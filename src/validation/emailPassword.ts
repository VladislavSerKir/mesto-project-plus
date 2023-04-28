import { passwordPattern } from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(new RegExp(passwordPattern)).required(),
  }),
});
