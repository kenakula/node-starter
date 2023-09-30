import { config } from 'dotenv';
import process from 'node:process';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  HOST,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  BODY_LIMIT,
  URL_LIMIT,
  PUBLIC_FOLDER,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_USER,
  API_VERSION,
  API_ROOT,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET,
  JWT_COOKIE_EXPIRES_DAYS,
  PASSWORD_HASH_SALT,
  AUTH_COOKIE_NAME,
} = process.env;

export const baseUrl = `${HOST}${NODE_ENV === 'development' ? `:${PORT}` : ''}`;
export const apiUrl = `${baseUrl}${API_ROOT}/${API_VERSION}`;
export const protocol = NODE_ENV === 'development' ? 'http' : 'https';
