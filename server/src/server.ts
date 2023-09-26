import 'reflect-metadata';
import { App } from './app';
import { DefaultRoute } from '@app/routes';
import process from 'node:process';

const app = new App([new DefaultRoute()]);

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 💥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exitCode = 1;
});

app.listen();
