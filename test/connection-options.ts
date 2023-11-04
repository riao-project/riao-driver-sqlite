import { SqliteConnectionOptions } from '../src';
import { env } from './env';

export const connectionOptionsSqlite: SqliteConnectionOptions = {
	host: env.TEST_SQLITE_HOST,
	port: env.TEST_SQLITE_PORT,
	database: env.TEST_SQLITE_DATABASE,
	username: env.TEST_SQLITE_USERNAME,
	password: env.TEST_SQLITE_PASSWORD,
};
