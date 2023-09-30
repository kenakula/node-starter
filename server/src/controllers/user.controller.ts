import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@app/services';
import {
  ICreateRequest,
  IForgotPassword,
  IPatchRequest,
  IResetPassword,
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

      res
        .status(HttpStatusCode.OK)
        .json({ data, status: 'success', count: data.length });
    } catch (err) {
      next(err);
    }
  };

  public getUser = async (
    req: Request<{ id: string }>,
    res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    const id = req.params.id;

    try {
      const data: IUser = await this.service.getUser(id);

      if (!data) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: 'no user found',
          status: 'error',
        });
      }

      return res.status(HttpStatusCode.OK).json({
        data,
        status: 'success',
      });
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (
    { body, params }: IPatchRequest<IUser, { id: string }>,
    res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    const id = params.id;

    try {
      const data: IUser = await this.service.updateUser(id, body);

      return res.status(HttpStatusCode.ACCEPTED).json({
        data,
        status: 'success',
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (
    { params }: IPatchRequest<{}, { id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const id = params.id;

    try {
      await this.service.deleteUser(id);

      return res.status(HttpStatusCode.ACCEPTED).json({
        message: 'user removed successfully',
        status: 'success',
      });
    } catch (err) {
      next(err);
    }
  };

  public createUser = async (
    { body }: ICreateRequest<IUser>,
    res: TResponse<IUser>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.service.createUser(body);

      res.status(HttpStatusCode.CREATED).json({ data, status: 'success' });
    } catch (err) {
      next(err);
    }
  };

  public forgotPassword = async (
    { body: { email } }: ICreateRequest<IForgotPassword>,
    res: TResponse<void>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.forgotPassword({ email });

      res.status(HttpStatusCode.OK).json({
        data: undefined,
        status: 'success',
        message: 'confirm email send',
      });
    } catch (err) {
      next(err);
    }
  };

  public resetPassword = async (
    {
      params: { token },
      body: { password, passwordConfirm },
    }: ICreateRequest<IResetPassword, { token: string }>,
    res: TResponse<void>,
    next: NextFunction,
  ) => {
    try {
      if (!password || !passwordConfirm) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          data: undefined,
          message: 'No new password and passwordConfirm sent',
          status: 'error',
        });
      }

      await this.service.resetPassword({ passwordConfirm, password }, token);

      res.status(HttpStatusCode.OK).json({
        data: undefined,
        status: 'success',
        message: 'password was reset',
      });
    } catch (err) {
      next(err);
    }
  };

  public confirmEmail = async (
    { params: { token } }: Request<{ token: string }>,
    res: TResponse<void>,
    next: NextFunction,
  ) => {
    try {
      await this.service.confirmEmail(token);

      res.status(HttpStatusCode.OK).json({
        data: undefined,
        status: 'success',
        message: 'email confirmed',
      });
    } catch (err) {
      next(err);
    }
  };

  public updatePassword = async (
    {
      params: { token },
      body,
    }: ICreateRequest<IUpdatePassword, { token: string }>,
    res: TResponse<void>,
    next: NextFunction,
  ) => {
    try {
      if (!body) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          data: undefined,
          message: 'No new password or currentPassword or passwordConfirm sent',
          status: 'error',
        });
      }

      await this.service.updatePassword(body, token);

      res.status(HttpStatusCode.OK).json({
        data: undefined,
        status: 'success',
        message: 'password was changed',
      });
    } catch (err) {
      next(err);
    }
  };
}
