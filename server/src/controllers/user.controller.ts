import { NextFunction, Request } from 'express';
import { Container } from 'typedi';
import { UserService } from '@app/services';
import {
  IAppRequest,
  IForgotPassword,
  IResetPassword,
  ISafeUser,
  IUpdatePassword,
  IUser,
  TResponse,
} from '@shared/interfaces';
import { HttpStatusCode } from '@shared/enums';

export class UserController {
  public service: UserService = Container.get(UserService);

  public getUsers = async (
    _req: Request,
    res: TResponse<IUser[]>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: IUser[] = await this.service.getUsers();

      res.status(HttpStatusCode.OK).json({
        data,
        status: 'success',
        statusCode: HttpStatusCode.OK,
        count: data.length,
      });
    } catch (err) {
      next(err);
    }
  };

  public getUser = async (
    { params }: IAppRequest<{}, { id: string }>,
    res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    const id = params.id;

    try {
      const data: IUser = await this.service.getUser(id);

      if (!data) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: 'no user found',
          status: 'error',
          statusCode: HttpStatusCode.NOT_FOUND,
        });
      }

      return res.status(HttpStatusCode.OK).json({
        data,
        status: 'success',
        statusCode: HttpStatusCode.OK,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (
    { body, params }: IAppRequest<IUser, { id: string }>,
    res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    const id = params.id;

    try {
      const data: IUser = await this.service.updateUser(id, body);

      return res.status(HttpStatusCode.ACCEPTED).json({
        data,
        status: 'success',
        statusCode: HttpStatusCode.ACCEPTED,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (
    { params }: IAppRequest<{}, { id: string }>,
    res: TResponse<null>,
    next: NextFunction,
  ) => {
    const id = params.id;

    try {
      await this.service.deleteUser(id);

      return res.status(HttpStatusCode.ACCEPTED).json({
        message: 'user removed successfully',
        status: 'success',
        statusCode: HttpStatusCode.ACCEPTED,
      });
    } catch (err) {
      next(err);
    }
  };

  public createUser = async (
    { body }: IAppRequest<IUser>,
    res: TResponse<ISafeUser>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.service.createUser(body);

      res
        .status(HttpStatusCode.CREATED)
        .json({ data, status: 'success', statusCode: HttpStatusCode.CREATED });
    } catch (err) {
      next(err);
    }
  };

  public forgotPassword = async (
    { body: { email } }: IAppRequest<IForgotPassword>,
    res: TResponse<null>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.forgotPassword({ email });

      res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: 'email to reset password sent',
        statusCode: HttpStatusCode.OK,
      });
    } catch (err) {
      next(err);
    }
  };

  public resetPassword = async (
    {
      params: { token },
      body: { password, passwordConfirm },
    }: IAppRequest<IResetPassword, { token: string }>,
    res: TResponse<null>,
    next: NextFunction,
  ) => {
    try {
      await this.service.resetPassword({ passwordConfirm, password }, token);

      res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: 'password was reset',
        statusCode: HttpStatusCode.OK,
      });
    } catch (err) {
      next(err);
    }
  };

  public confirmEmail = async (
    { params: { token } }: IAppRequest<{}, { token: string }>,
    res: TResponse<null>,
    next: NextFunction,
  ) => {
    try {
      await this.service.confirmEmail(token);

      res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: 'email confirmed',
        statusCode: HttpStatusCode.OK,
      });
    } catch (err) {
      next(err);
    }
  };

  public updatePassword = async (
    { params: { id }, body }: IAppRequest<IUpdatePassword, { id: string }>,
    res: TResponse<null>,
    next: NextFunction,
  ) => {
    try {
      if (!body) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: 'No new password or currentPassword or passwordConfirm sent',
          status: 'error',
          statusCode: HttpStatusCode.BAD_REQUEST,
        });
      }

      await this.service.updatePassword(body, id);

      res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: 'password was changed',
        statusCode: HttpStatusCode.OK,
      });
    } catch (err) {
      next(err);
    }
  };
}
