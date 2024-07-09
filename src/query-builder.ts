import { DatabaseFunctions, DatabaseQueryBuilder } from '@riao/dbal';
import { SqliteBuilder } from './sql-builder';
import { DatabaseFunction } from '@riao/dbal/functions/function-token';

export class SqliteQueryBuilder extends DatabaseQueryBuilder {
	public constructor() {
		super();
	}

	protected getSqlType() {
		return SqliteBuilder;
	}

	public override date(fn: DatabaseFunction): this {
		this.sql.append('date');
		this.sql.openParens();

		if (fn.params?.expr) {
			this.expression(fn.params.expr);
		}
		else {
			this.expression(DatabaseFunctions.currentTimestamp());
		}

		this.sql.closeParens();

		return this;
	}

	public override year(fn: DatabaseFunction): this {
		this.sql.append('strftime(\'%Y\', ');

		if (fn.params?.expr) {
			this.expression(fn.params.expr);
		}
		else {
			this.expression(DatabaseFunctions.currentTimestamp());
		}

		this.sql.closeParens();

		return this;
	}
}
