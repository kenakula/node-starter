import { Request, Response } from 'express';

export interface IResponseBody<T> {
  data?: T;
  status: 'success' | 'error';
  message?: string;
}

export type TResponse<T> = Response<IResponseBody<T>>;

export interface ICreateRequest<T, P = {}> extends Request<P> {
  body: T;
  params: P;
}

export interface IPatchRequest<T, P = {}> extends Request<P> {
  body: Partial<T>;
  params: P;
}

export interface IProcessError {
  name: string;
  message: string;
}
