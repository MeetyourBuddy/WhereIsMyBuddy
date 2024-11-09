// handles connection to the MongoDB database using Mongoose

import mongoose from 'mongoose';
import config from './server.config.js';
import logger from '../utils/logger.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.database.url);

    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);

    throw error;
  }
};

export default connectToDatabase;
