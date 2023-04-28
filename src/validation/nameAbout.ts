import { maxAvatarLength, maxNameLength, minLength } from "../utils";

const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(minLength).max(maxNameLength),
    about: Joi.string().required().min(minLength).max(maxAvatarLength),
  }),
});
