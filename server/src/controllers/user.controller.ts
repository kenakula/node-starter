import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@app/services';
import {
  ICreateRequest,
  IPatchRequest,
  IUser,
  TResponse,
} from '@shared/interfaces';

export class UserController {
  public service: UserService = Container.get(UserService);

  public getUsers = async (
    _req: Request,
    res: TResponse<IUser[]>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: IUser[] = await this.service.getUsers();

      res.status(200).json({ data, status: 'success', count: data.length });
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
        return res.status(404).json({
          message: 'no user found',
          status: 'error',
        });
      }

      return res.status(200).json({
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

      return res.status(202).json({
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

      return res.status(202).json({
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

      res.status(201).json({ data, status: 'success' });
    } catch (err) {
      next(err);
    }
  };
}
