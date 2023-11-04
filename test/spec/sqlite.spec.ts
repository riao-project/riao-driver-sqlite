import 'jasmine';
import { DatabaseSqlite } from '../../src';
import { connectionOptionsSqlite } from '../connection-options';
import { test } from '@riao/driver-test';
import { env } from '../env';

test({
	name: 'Sqlite 3',
	db: DatabaseSqlite,
	expectedVersion: /^3\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsSqlite,
	rootDatabase: env.TEST_SQLITE_ROOT_DATABASE,
});
