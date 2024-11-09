import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { unknownEndpoint, errorHandler, sessionMiddleware } from './middlewares/middleware.js';
import serverConfig from './config/server.config.js';
import routes from './routes/index.js';
import swaggerDocs from './swagger-ui/swagger.js';
import { luciaMiddleware } from './auth.js';

const app = express();

// Middleware
app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Error handling middleware
app.use(unknownEndpoint);
app.use(errorHandler);
app.use(sessionMiddleware);

// Apply Lucia middleware
app.use(luciaMiddleware());

// API routes
app.use('/api/v1', routes);

// Swagger UI docs
swaggerDocs(app);

export default app;
