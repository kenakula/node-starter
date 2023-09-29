import { Router } from 'express';
import { AuthController } from '@app/controllers';

export class AuthRoute {
  public path = '/auth';
  public router = Router();
  private controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.controller.signUp);
  }
}
