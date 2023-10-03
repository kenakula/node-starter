import 'reflect-metadata';
import process from 'node:process';
import { AuthRoute, UserRoute } from '@app/routes';
import { App } from './app';

const app = new App([new UserRoute(), new AuthRoute()]);

app.connectToDatabase().then(() => {
  app.listen();

  process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💥 SHUTTING DOWN...');
    console.log(err.name, err.message);
    process.exitCode = 1;
  });
});
