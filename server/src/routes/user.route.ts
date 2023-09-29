import { Router } from 'express';
import { UserController } from '@app/controllers';

export class UserRoute {
  public path = '/users';
  public router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.controller.getUsers);
    this.router.post(this.path, this.controller.createUser);
  }
}
