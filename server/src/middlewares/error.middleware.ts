import { Request, Response } from 'express';
import { IGlobalError } from '@app/interfaces';
import { getDbError, sendDevError, sendProdError } from '@utils/errors';

export const ErrorMiddleware = (
  error: IGlobalError,
  req: Request,
  res: Response,
) => {
  const errorStatusCode = error.status || 500;
  const err: IGlobalError = { ...error, errorStatusCode };
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    sendDevError(err, req, res);
  } else {
    const enhancedError: IGlobalError = { ...err, message: getDbError(error) };
    sendProdError(enhancedError, req, res);
  }
};
