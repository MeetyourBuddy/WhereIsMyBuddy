/*
- This is the validation schema for the environment variables
- Prevents application from starting with missing required configuration
- Provides default values where appropriate
*/

import Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
});