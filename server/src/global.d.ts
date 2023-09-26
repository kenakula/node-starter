declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
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
  }
}
