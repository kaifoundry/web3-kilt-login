// @ts-ignore
import swaggerJSDoc from 'swagger-jsdoc';
// @ts-ignore
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.APP_NAME,
      version: process.env.APP_VERSION,
      description: 'API documentation using Swagger UI',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, 
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
