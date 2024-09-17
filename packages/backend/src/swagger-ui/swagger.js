const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Buddy API Documentation',
      version: '1.0.0',
      description: 'API documentation for Buudy: Find you study buddy app.'
    },
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    servers: [
      {
        url: process.env.SWAGGER_URL
      }
    ]
  },
  apis: ['src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Swagger Page
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;
