import { connect, set } from 'mongoose';
import { DB_HOST, DB_PASSWORD, DB_USER, NODE_ENV, DB_PORT } from '@app/configs';

export const connectDatabase = async () => {
  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(`mongodb://mongo:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`, {
    user: DB_USER,
    pass: DB_PASSWORD,
  })
    .then(() => {
      console.log('Connection to DB established 🤩');
    })
    .catch(() => {
      console.log('Connection to DB failed 😵‍💫');
    });
};
