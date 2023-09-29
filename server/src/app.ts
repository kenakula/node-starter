import express from 'express';
import process from 'node:process';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options as SwaggerOptions } from 'swagger-jsdoc';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { logger, stream } from '@app/utils';
import {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
  rateLimiterConfig,
  API_VERSION,
  API_ROOT,
  hppOptionsConfig,
} from '@app/configs';
import { IProcessError, Route } from '@app/interfaces';
import { connectDatabase } from '@app/database/connect.database';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import * as path from 'path';
import { ErrorMiddleware } from '@app/middlewares';
import { HttpException } from '@app/exceptions';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public apiVersion: string;
  public apiRoot: string;
  public limiter: RateLimitRequestHandler;

  constructor(routes: Route[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || '4000';
    this.apiRoot = API_ROOT || '/api';
    this.apiVersion = API_VERSION || 'v1';
    this.limiter = rateLimit(rateLimiterConfig);

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandler();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port: ${this.port} 🚀 `);
      logger.info(`=================================`);
    });

    process.on('unhandledRejection', (err: IProcessError) => {
      console.log(err.name, err.message);
      console.log('UNHANDLED REJECTION 💥 SHUTTING DOWN...');
      server.close(() => {
        process.exit(1);
      });
    });
  }

  public connectToDatabase = async () => {
    await connectDatabase();
  };

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(API_ROOT, this.limiter);
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp(hppOptionsConfig));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1kb' }));
    this.app.use(mongoSanitize());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route =>
      this.app.use(`${API_ROOT}/${this.apiVersion}/`, route.router),
    );

    this.app.use(async (_req, _res, next) => {
      next(new HttpException(404, 'no such route'));
    });
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
