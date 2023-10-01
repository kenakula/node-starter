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
    this.router.get(this.path, AuthGuard.protect, this.controller.getUsers);

    this.router.get(
      `${this.path}/:id`,
      AuthGuard.protect,
      AuthGuard.restrict(['admin']),
      this.controller.getUser,
    );

    this.router.post(
      this.path,
      AuthGuard.protect,
      AuthGuard.restrict(['admin']),
      this.controller.createUser,
    );

    this.router.patch(
      `${this.path}/:id`,
      AuthGuard.protect,
      AuthGuard.protectUpdateUser,
      this.controller.updateUser,
    );

    this.router.delete(
      `${this.path}/:id`,
      AuthGuard.protect,
      AuthGuard.restrict(['admin']),
      this.controller.deleteUser,
    );

    this.router.post(
      `${this.path}/forgot-password`,
      this.controller.forgotPassword,
    );

    this.router.get(
      `${this.path}/reset-password/:token`,
      this.controller.resetPassword,
    );

    this.router.get(
      `${this.path}/confirm-email/:token`,
      AuthGuard.protect,
      this.controller.confirmEmail,
    );

    this.router.post(
      `${this.path}/update-password/:id`,
      AuthGuard.protect,
      AuthGuard.isSameUser,
      this.controller.updatePassword,
    );
  }
}
