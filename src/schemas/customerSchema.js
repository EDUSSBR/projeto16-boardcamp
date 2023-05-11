import Joi from 'joi';

export const custormerSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required(),
  phone: Joi.string().pattern(/^[1-9]{2}9?[6-9][0-9]{3}[0-9]{4}$/).required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required(),
  birthday: Joi.date().iso().required(),
});
