declare namespace NodeJS {
  type TNodeEnv = 'production' | 'development' | 'test';

  interface ProcessEnv {
    NODE_ENV: TNodeEnv;
    PORT: string;
    HOST: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_DAYS: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    AUTH_COOKIE_NAME: string;
    PASSWORD_HASH_SALT: string;
    LOG_FORMAT: string;
    LOG_DIR: string;
    ORIGIN: string;
    CREDENTIALS: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    API_VERSION: string;
    API_ROOT: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    BODY_LIMIT: string;
    URL_LIMIT: string;
    PUBLIC_FOLDER: string;
  }
}
