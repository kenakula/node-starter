import { CookieOptions } from 'express';
import { JWT_COOKIE_EXPIRES_DAYS, NODE_ENV } from './env.config';
import { DateUtils } from '@app/shared/utils/date.utils';

export const authCookieConfig: CookieOptions = {
  secure: NODE_ENV === 'production',
  httpOnly: true,
  expires: new Date(
    Date.now() + DateUtils.daysToMs(Number(JWT_COOKIE_EXPIRES_DAYS)),
  ),
};
