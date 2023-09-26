import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options as SwaggerOptions } from 'swagger-jsdoc';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { logger, stream } from '@app/utils';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@app/configs';
import { ErrorMiddleware } from '@app/middlewares';
import { Route } from '@app/interfaces';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Route[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || '4000';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandler();
  }

  public getServer(): express.Application {
    return this.app;
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port: ${this.port}`);
      logger.info(`=================================`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => this.app.use('/', route.router));
  }

  private initializeSwagger() {
    const options: SwaggerOptions = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          description: 'NodeJS API',
          version: '1.0.0',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandler() {
    this.app.use(ErrorMiddleware);
  }
}
