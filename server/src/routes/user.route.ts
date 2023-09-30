import { Router } from 'express';
import { UserController } from '@app/controllers';
import { AuthGuard } from '@app/guards';

export class UserRoute {
  public path = '/users';
  public router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.controller.getUsers);
    this.router.post(
      this.path,
      AuthGuard.protect,
      AuthGuard.restrict(['admin']),
      this.controller.createUser,
    );
    this.router.get(`${this.path}/:id`, this.controller.getUser);
    this.router.patch(`${this.path}/:id`, this.controller.updateUser);
    this.router.delete(`${this.path}/:id`, this.controller.deleteUser);
  }
}
