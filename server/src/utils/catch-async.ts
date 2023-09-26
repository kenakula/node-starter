import { NextFunction, Request, Response } from 'express';
import { TMiddlewareFunction } from '@app/types';

export const catchAsync =
  (fn: TMiddlewareFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
