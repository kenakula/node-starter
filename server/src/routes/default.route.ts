import { Route } from '@app/interfaces';
import { Router } from 'express';
import { DefaultController } from '@controllers/default.controller';
import { ValidationMiddleware } from '@app/middlewares';
import { CreateDefaultDTO } from '@app/dtos/default.dto';

export class DefaultRoute implements Route {
  public path = '/default';
  public router = Router();
  private defaultController = new DefaultController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.defaultController.getData);
    this.router.post(
      this.path,
      ValidationMiddleware(CreateDefaultDTO),
      this.defaultController.createData,
    );
  }
}
