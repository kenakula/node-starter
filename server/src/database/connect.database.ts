import { connect, set } from 'mongoose';
import { DB_HOST, NODE_ENV, DB_PORT, DB_NAME } from '@app/configs';

export const connectDatabase = async () => {
  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
    .then(() => {
      console.log('Connection to DB established');
    })
    .catch(err => {
      console.log(`Connection to DB failed: ${err}`);
    });
};
