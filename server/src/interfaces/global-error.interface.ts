import { HttpException } from '@app/exceptions';
import { TErrorName } from '@app/types';

export interface IGlobalError extends HttpException {
  errorStatusCode: number;
  name: TErrorName;
  path: string;
  value: string;
  code: number;
}
