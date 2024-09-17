//app configurations

require('dotenv').config();

let url;

// If NODE_ENV is Test, set url to Test
if (process.env.NODE_ENV === 'test') {
  url = process.env.TEST_MONGODB_URI;
} else {
  url = process.env.MONGODB_URI;
}

// SERVER CONFIG
module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    url: url || 'mongodb://localhost:27017',
    dbName: process.env.DATABASE_NAME || 'myapp'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  api: {
    prefix: '/api/v1'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key'
  }
};
