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
    this.router.get(`${this.path}/:id`, this.controller.getUser);
    this.router.patch(`${this.path}/:id`, this.controller.updateUser);
    this.router.delete(`${this.path}/:id`, this.controller.deleteUser);
  }
}
