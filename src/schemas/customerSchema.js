import Joi from 'joi';

export const customerSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().max(200).required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required(),
  birthday: Joi.date().iso().required(),
});
