const winston = require('winston');
const appRoot = require('app-root-path');
const path = require('path');

const options = {
  file: {
    level: 'info',
    filename: path.join(appRoot.path, 'logs', 'app.log'),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json())
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    logger.info(message);
  }
};

module.exports = logger;
