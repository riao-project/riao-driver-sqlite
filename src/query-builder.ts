import { DatabaseQueryBuilder } from '@riao/dbal';
import { SqliteBuilder } from './sql-builder';

export class SqliteQueryBuilder extends DatabaseQueryBuilder {
	public constructor() {
		super();
	}

	protected getSqlType() {
		return SqliteBuilder;
	}
}
