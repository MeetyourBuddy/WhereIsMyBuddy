import app from './app.js';
import logger from './utils/logger.js';
import serverConfig from './config/server.config.js';
import connectToDatabase from './config/database.config.js';
import { initializeLucia } from './auth.js';

const startServer = async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Initialize Lucia
    await initializeLucia();

    // Start the server
    app.listen(serverConfig.port, () => {
      logger.info(`Server running on port ${serverConfig.port}`);
      logger.info(`Environment: ${serverConfig.environment}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
