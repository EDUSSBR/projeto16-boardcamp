const Joi = require('joi');

export const gameSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().integer().positive().required(),
  pricePerDay: Joi.number().integer().positive().required(),
});
