import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } =
  process.env;
export const { DB_HOST, DB_PASSWORD, DB_NAME, DB_PORT, DB_USER } = process.env;
export const { API_VERSION, API_ROOT } = process.env;
export const { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USERNAME } =
  process.env;
