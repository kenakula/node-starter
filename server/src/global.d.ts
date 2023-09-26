declare namespace NodeJS {
  type TNodeEnv = 'production' | 'development' | 'test';

  interface ProcessEnv {
    NODE_ENV: TNodeEnv;
    PORT: string;
    HOST: string;
    SECRET_KEY: string;
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
  }
}
