// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const middleware = require('./middlewares/middleware');
const serverConfig = require('./config/server.config');
const bodyParser = require('body-parser'); 
const { luciaMiddleware } = require('./auth.js'); // Import Lucia middleware setup
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors(serverConfig.cors)); // Apply CORS configuration
app.use(bodyParser.json()); // Parse JSON bodies
app.use(morgan('combined', { stream: logger.stream })); // Logging

// Apply Lucia middleware for authentication
app.use('/protected', luciaMiddleware()); // Apply Lucia middleware to specific routes

// Use the routes defined in index.js
const routes = require('./routes'); // Import routes from index.js
app.use('/', routes); // Mount all routes under the root path

// Error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
