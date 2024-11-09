import logger from '../utils/logger.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from '../config/server.config.js';

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// Session middleware function
const sessionMiddleware = session({
  secret: config.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.environment === 'production', // Only send cookie over HTTPS in production
    httpOnly: true, // Helps prevent client-side script from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time (1 day)
  },
  store: MongoStore.create({
    mongoUrl: config.database.url
  })
});

export { unknownEndpoint, errorHandler, sessionMiddleware };
