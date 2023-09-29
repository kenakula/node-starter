import { Request, Response } from 'express';

export interface IResponseBody<T> {
  data?: T;
  status: 'success' | 'error';
  message?: string;
}

export type TResponse<T> = Response<IResponseBody<T>>;

export interface ICreateRequest<T> extends Request {
  body: T;
}

export interface IProcessError {
  name: string;
  message: string;
}
