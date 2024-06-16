import mongoose from 'mongoose';
import { DB_CONNECTION_TOKEN } from '@/constants/system.constant';
import { MONGO_DB } from '@/app.config';
import { createLogger } from '@/utils/logger';
import { isDevEnv } from '@/app.environment';

const logger = createLogger({ scope: 'MongoDB', time: isDevEnv });

export const databaseProvider = {
  inject: [],
  provide: DB_CONNECTION_TOKEN,
  useFactory: async () => {
    let reconnectionTask: NodeJS.Timeout | null = null;
    const RECONNECT_INTERVAL = 6000;

    const connection = () => {
      return mongoose.connect(MONGO_DB.uri, {});
    };

    // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
    // Use `mongoose.set('strictQuery', false);` if you want to prepare for this change.
    // Or use `mongoose.set('strictQuery', true);` to suppress this warning.
    // https://mongoosejs.com/docs/guide.html#strictQuery
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connecting', () => {
      logger.log('connecting...');
    });

    mongoose.connection.on('open', () => {
      logger.success('readied (open).');
      if (reconnectionTask) {
        clearTimeout(reconnectionTask);
        reconnectionTask = null;
      }
    });

    mongoose.connection.on('disconnected', () => {
      logger.error(`disconnected! retry after ${RECONNECT_INTERVAL / 1000}s`);
      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
    });

    mongoose.connection.on('error', (error) => {
      logger.error('error!', error);
      mongoose.disconnect();
    });

    return await connection();
  },
};
