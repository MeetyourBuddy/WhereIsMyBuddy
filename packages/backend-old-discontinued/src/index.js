const app = require('./app');
const logger = require('./utils/logger');
const serverConfig = require('./config/server.config');
const connectToDatabase = require('./config/database.config');

const startServer = async () => {
  try {
    // Connect to the database
    await connectToDatabase();

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
