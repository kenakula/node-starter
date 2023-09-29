import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerConfig: SwaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'REST API',
      description: 'NodeJS API',
      version: '1.0.0',
    },
  },
  apis: ['swagger.yaml'],
};
