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
  message?: string;
  count?: number;
}

export interface ICreateRequest<T, P = {}> extends Request<P> {
  body: T;
  params: P;
}

export interface IPatchRequest<T, P = {}> extends Request<P> {
  body: Partial<T>;
  params: P;
}

export interface IProtectRequest extends Request {
  user: Pick<IUser, 'id' | 'role'>;
}

export interface IProcessError {
  name: string;
  message: string;
}
