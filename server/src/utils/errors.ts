import { Request, Response } from 'express';
import { IGlobalError } from '@app/interfaces';
import { HttpException } from '@app/exceptions';
import { logger } from '@utils/logger';

export const sendProdError = (
  { errorStatusCode, isOperational, message }: IGlobalError,
  _req: Request,
  res: Response,
): Response => {
  if (isOperational) {
    return res.status(errorStatusCode).json({
      status: errorStatusCode,
      message,
    });
  }

  logger.error('ERROR: 💥 Something went wrong', { errorStatusCode, message });

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

export const sendDevError = (
  err: IGlobalError,
  _req: Request,
  res: Response,
): void => {
  const { errorStatusCode, message, name, status, stack } = err;

  res.status(errorStatusCode).json({
    status,
    name,
    error: err,
    message,
    stack,
  });
};

const getJWTError = (): string =>
  new HttpException(401, 'Invalid token. Please log in again!').message;

const getJWTExpiredError = (): string =>
  new HttpException(401, 'Your token has expired! Please log in again!')
    .message;

export const getDbError = ({
  message: errorMessage,
  name,
  path,
  value,
  code,
}: IGlobalError) => {
  let message = errorMessage;

  switch (name) {
    case 'CastError':
      message = `Invalid ${path}: ${value}`;
      break;
    case 'MongoError':
      if (code === 11000) {
        message = `Duplicate object fields: ${value}`;
      }
      break;
    case 'JsonWebTokenError':
      message = getJWTError();
      break;
    case 'TokenExpiredError':
      message = getJWTExpiredError();
      break;
  }

  return message;
};
