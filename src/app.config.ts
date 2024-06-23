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

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600,
  data: argv.auth_data || { user: 'root' },
  jwtSecret: argv.auth_key || 'nestapi',
  defaultPassword: argv.auth_default_password || 'root',
};

export const EMAIL = {
  port: 587,
  host: argv.email_host || 'your email host, e.g. smtp.qq.com',
  account: argv.email_account || 'your email address, e.g. admin@example.me',
  password: argv.email_password || 'your email password',
  from: `"${APP.FE_NAME}" <${argv.email_from || argv.email_account}>`,
};

export const AWS = {
  accessKeyId: argv.aws_access_key_id as string,
  secretAccessKey: argv.aws_secret_access_key as string,
  s3StaticRegion: argv.aws_s3_static_region as string,
  s3StaticBucket: argv.aws_s3_static_bucket as string,
};
