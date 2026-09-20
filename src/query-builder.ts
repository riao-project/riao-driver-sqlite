import {
	columnName,
	DatabaseFunctions,
	DatabaseQueryBuilder,
	Expression,
	SelectQuery,
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

	// SQLite doesn't support wrapping outer SELECT in parentheses for INTERSECT
	// with WHERE clauses (syntax error)
	protected shouldWrapIntersectQuery(): boolean {
		return false;
	}

	// SQLite's parser also rejects parentheses around inner SELECT statements
	// with WHERE clauses. Override to inline the query without wrapping.
	public intersectWithSubquery(query: SelectQuery, all = false): this {
		this.sql.trimEnd(' ');
		this.sql.append(all ? ' INTERSECT ALL ' : ' INTERSECT ');
		// Inline the query without Subquery wrapping (no parentheses)
		this.select(query);
		this.sql.space();

		return this;
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

	public override day(fn: DatabaseFunction): this {
		this.sql.append('strftime(\'%d\', ');

		if (fn.params?.expr) {
			this.expression(fn.params.expr);
		}
		else {
			this.expression(DatabaseFunctions.currentTimestamp());
		}

		this.sql.closeParens();

		return this;
	}

	public override month(fn: DatabaseFunction): this {
		this.sql.append('strftime(\'%m\', ');

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

	public override intersectAll(query: SelectQuery): this {
		// SQLite doesn't support INTERSECT ALL
		throw new Error('SQLite does not support INTERSECT ALL. Use INTERSECT instead.');
	}
}
