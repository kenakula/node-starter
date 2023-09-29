import { Container } from 'typedi';
import { UserService } from '@app/services';
import { ICreateRequest, IUser, TResponse } from '@app/interfaces';
import { NextFunction, Request } from 'express';

export class UserController {
  public service: UserService = Container.get(UserService);

  public getUsers = async (
    _req: Request,
    res: TResponse<IUser[]>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: IUser[] = await this.service.findAll();

      res.status(200).json({ data, status: 'success' });
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
      const data = await this.service.create(body);

      res.status(201).json({ data, status: 'success' });
    } catch (err) {
      next(err);
    }
  };
}
