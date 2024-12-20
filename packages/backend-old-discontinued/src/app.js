// src/app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const middleware = require('./middlewares/middleware');
const serverConfig = require('./config/server.config');

const app = express();

// Middleware
app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
