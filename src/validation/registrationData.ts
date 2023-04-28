import {
  maxAvatarLength, maxNameLength, minLength, passwordPattern, urlPattern,
} from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(minLength).max(maxNameLength),
    about: Joi.string().min(minLength).max(maxAvatarLength),
    avatar: Joi.string().pattern(new RegExp(urlPattern)),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(new RegExp(passwordPattern)).required(),
  }),
});
