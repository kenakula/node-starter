import { NextFunction, Request, Response } from 'express';
import { DefaultInterface, IResponseBody } from '@app/interfaces';

export type TMiddlewareFunction = (
  req: Request,
  res: Response<IResponseBody<DefaultInterface[]>>,
  next: NextFunction,
) => Promise<void>;
