import {
	columnName,
	DatabaseFunctions,
	DatabaseQueryBuilder,
	Expression,
} from '@riao/dbal';
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

	public override triggerSetValue(options: {
		table: string;
		idColumn: string;
		column: string;
		value: Expression;
	}): this {
		const key = options.idColumn;

		return this.update({
			table: options.table,
			set: { [options.column]: options.value },
			where: { [`${options.table}.${key}`]: columnName('NEW.' + key) },
		});
	}
}
