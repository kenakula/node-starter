import { Options } from 'express-rate-limit';

export const rateLimiterConfig: Partial<Options> = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
};
