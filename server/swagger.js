import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My contacts API',
      version: '1.0.0',
      description: 'An Express My contacts API with Swagger documentation',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export { specs };