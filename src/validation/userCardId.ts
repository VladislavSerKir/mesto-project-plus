const { celebrate, Joi } = require('celebrate');

export default celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
