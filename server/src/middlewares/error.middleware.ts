import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';

export const ErrorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: HttpStatusCode = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
