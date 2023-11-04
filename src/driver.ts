import {
	DatabaseConnectionOptions,
	DatabaseDriver,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from '@riao/dbal';
import { Transaction } from '@riao/dbal/database/transaction';

import * as sqlite from 'better-sqlite3';

export type SqliteConnectionOptions = DatabaseConnectionOptions;

function getErrorMsg(options: {
	op: string;
	error: any;
	sql?: string;
	params?: any[];
}): string {
	return JSON.stringify({
		op: 'query',
		msg: options.error instanceof Error ? options.error.message : null,
		sql: options.sql,
		params: options.params,
		error: options.error,
	});
}

export class SqliteDriver extends DatabaseDriver {
	public conn: sqlite;

	public async connect(options: SqliteConnectionOptions): Promise<this> {
		try {
			this.conn = new sqlite(options.database, null);
		}
		catch (error) {
			throw new Error(getErrorMsg({ op: 'connect', error }));
		}

		return this;
	}

	public async disconnect(): Promise<void> {
		try {
			await this.conn.close();
		}
		catch (error) {
			throw new Error(getErrorMsg({ op: 'disconnect', error }));
		}
	}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		let { sql, params } = this.toDatabaseQueryOptions(options);
		params = params ?? [];
		params = params.map((param) => {
			if (param === true) {
				return 1;
			}
			else if (param === false) {
				return 0;
			}
			else if (param instanceof Date) {
				return param.toISOString();
			}
			else {
				return param;
			}
		});

		if (!sql) {
			return {};
		}

		let rows;
		let retrieverFn: 'get' | 'all' | 'run';

		if (sql.startsWith('SELECT') || sql.startsWith('PRAGMA')) {
			if (sql.endsWith('LIMIT 1')) {
				retrieverFn = 'get';
			}
			else {
				retrieverFn = 'all';
			}
		}
		else {
			retrieverFn = 'run';
		}

		try {
			rows = this.conn.prepare(sql)[retrieverFn](params);
		}
		catch (error) {
			throw new Error(
				getErrorMsg({
					op: `query ${retrieverFn}`,
					error,
					sql,
					params,
				})
			);
		}

		if (rows === undefined) {
			return {};
		}
		else {
			return {
				results: Array.isArray(rows) ? rows : [rows],
			};
		}
	}

	public async getVersion(): Promise<string> {
		const { results } = await this.query({
			sql: 'SELECT sqlite_version() AS version;',
		});

		return results[0]?.version;
	}

	public async transaction<T>(
		fn: (transaction: Transaction) => Promise<T>,
		transaction: Transaction
	): Promise<T> {
		let result: T;

		// transaction.driver.conn = this.conn;
		// transaction.ddl.setDriver(transaction.driver);
		// transaction.query.setDriver(transaction.driver);

		await this.query({ sql: 'START TRANSACTION;' });

		try {
			result = await fn(transaction);
			await this.query({ sql: 'COMMIT;' });
		}
		catch (e) {
			await this.query({ sql: 'ROLLBACK;' });

			throw e;
		}

		return result;
	}
}
