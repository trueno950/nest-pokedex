import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required().error(new Error('uri database mongo is required ')),
  PORT: Joi.number().default(3001),
  DEFAULT_LIMIT: Joi.number().default(6),
});
