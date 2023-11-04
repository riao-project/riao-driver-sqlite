import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class Environment extends AppConfig {
	readonly APP_TITLE = 'riao-driver-sqlite';

	readonly TEST_SQLITE_HOST = '';
	readonly TEST_SQLITE_PORT = 0;
	readonly TEST_SQLITE_USERNAME = '';
	readonly TEST_SQLITE_PASSWORD = '';
	readonly TEST_SQLITE_DATABASE = ':memory:';
	readonly TEST_SQLITE_ROOT_DATABASE = '';
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
