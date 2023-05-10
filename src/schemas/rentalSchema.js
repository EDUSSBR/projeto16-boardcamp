const Joi = require('joi');

export const rentalSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  customerId: Joi.number().integer().positive().required(),
  gameId: Joi.number().integer().positive().required(),
  rentDate: Joi.date().iso().required(),
  daysRented: Joi.number().integer().positive().required(),
  returnDate: Joi.date().iso().allow(null),
  originalPrice: Joi.number().integer().positive().required(),
  delayFee: Joi.number().integer().positive().allow(null),
});
