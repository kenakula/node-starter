import { Request } from 'express';

export interface IResponseBody<T> {
  data: T;
  message: string;
}

export interface ICreateRequest<T> extends Request {
  body: T;
}

export interface IProcessError {
  name: string;
  message: string;
}
