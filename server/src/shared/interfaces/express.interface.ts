import { Request, Response, Router } from 'express';
import { IUser } from '@shared/interfaces/user.interface';

export interface Route {
  path?: string;
  router: Router;
}

export type TResponse<T> = Response<IResponseBody<T>>;

export interface IResponseBody<T> {
  data?: T;
  status: 'success' | 'error';
  statusCode: number;
  message?: string;
  count?: number;
}

export interface IAppRequest<T, P = {}> extends Request<P, {}, T> {
  params: P;
  user?: Pick<IUser, 'id' | 'role'>;
}

export interface IProtectRequest extends Request {
  user: Pick<IUser, 'id' | 'role'>;
}

export interface IProcessError {
  name: string;
  message: string;
}
