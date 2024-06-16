import path from 'path';
import yargs from 'yargs';

const ROOT_PATH = path.join(__dirname, '..');
const argv = yargs.argv as Record<string, string | void>;

const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'));

export const APP = {
  PORT: 8000,
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 0,
  NAME: 'NestApi',
  URL: 'https://api.nest.me',
  ADMIN_EMAIL: argv.admin_email || 'test@example.com',
  FE_NAME: 'Nest Api',
  FE_URL: '',
  STATIC_URL: '',
};

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
};

export const CROSS_DOMAIN = {
  allowedOrigins: [],
  allowedReferer: '',
};

export const MONGO_DB = {
  uri:
    argv.db_uri ||
    `mongodb://docker-mongo:docker-mongo@127.0.0.1:27017/NestApi?authSource=admin`,
};
