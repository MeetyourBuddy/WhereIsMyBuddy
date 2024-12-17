const mongoose = require('mongoose');
const config = require('./server.config');
const logger = require('../utils/logger');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.database.url);

    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);

    throw error;
  }
};

module.exports = connectToDatabase;
