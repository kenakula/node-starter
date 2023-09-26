import 'reflect-metadata';
import { App } from './app';
import { DefaultRoute } from '@app/routes';

const app = new App([new DefaultRoute()]);

app.listen();
