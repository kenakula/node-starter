import * as path from 'path';
import express from 'express';
import { Container } from 'typedi';
import process from 'node:process';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import {
  API_ROOT,
  API_VERSION,
  BODY_LIMIT,
  CREDENTIALS,
  hppOptionsConfig,
  LOG_FORMAT,
  NODE_ENV,
  ORIGIN,
  PORT,
  PUBLIC_FOLDER,
  rateLimiterConfig,
  URL_LIMIT,
} from '@app/configs';
import { IProcessError, Route, TResponse } from '@shared/interfaces';
import { connectDatabase } from '@app/database';
import { errorMiddleware } from '@app/middlewares';
import { EmailService } from '@app/services';
import { HttpStatusCode } from '@shared/enums';
import YAML from 'yamljs';
import { logger, stream } from '@shared/utils';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public apiVersion: string;
  public apiRoot: string;
  public limiter: RateLimitRequestHandler;
  public emailService = Container.get(EmailService);

  constructor(routes: Route[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || '4000';
    this.apiRoot = API_ROOT || '/api';
    this.apiVersion = API_VERSION || 'v1';
    this.limiter = rateLimit(rateLimiterConfig);

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandler();

    this.initializeEmailService();

    this.handleNotFoundRoute();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port: ${this.port} 🚀 `);
      logger.info(`=================================`);
    });

    process.on('unhandledRejection', (err: IProcessError) => {
      logger.error(err.name, err.message);
      logger.info('UNHANDLED REJECTION 💥 SHUTTING DOWN...');
      server.close(() => {
        process.exit(1);
      });
    });
  }

  public connectToDatabase = async () => {
    return connectDatabase();
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
    this.app.use(express.json({ limit: BODY_LIMIT }));
    this.app.use(express.urlencoded({ extended: true, limit: URL_LIMIT }));
    this.app.use(mongoSanitize());
    this.app.use(express.static(path.join(__dirname, PUBLIC_FOLDER)));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route =>
      this.app.use(`${API_ROOT}/${this.apiVersion}/`, route.router),
    );
  }

  private initializeSwagger() {
    const specs = YAML.load('swagger.yaml');

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandler(): void {
    this.app.use(errorMiddleware);
  }

  private initializeEmailService(): void {
    this.emailService.init();
  }

  private handleNotFoundRoute(): void {
    this.app.use((_req, res: TResponse<null>) => {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: 'Requested endpoint does not exist',
        status: 'error',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    });
  }
}
