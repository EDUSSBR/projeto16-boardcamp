import Joi from 'joi';

export const rentalSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  rentDate: Joi.date().iso().optional(),
  returnDate: Joi.date().iso().allow(null).optional(),
  originalPrice: Joi.number().integer().positive().optional(),
  delayFee: Joi.number().integer().positive().allow(null).optional(),
  customerId: Joi.number().integer().positive().required(), //
  gameId: Joi.number().integer().positive().required(),//
  daysRented: Joi.number().integer().positive().required(),//
});
