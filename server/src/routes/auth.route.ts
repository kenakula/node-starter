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
    this.router.post(`${this.path}/login`, this.controller.signIn);
    this.router.post(`${this.path}/refresh`, this.controller.refreshToken);
  }
}
