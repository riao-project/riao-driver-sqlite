import {
	AddForeignKeyOptions,
	BaseIntColumnOptions,
	ColumnOptions,
	ColumnType,
	CreateDatabaseOptions,
	DataDefinitionBuilder,
	DropDatabaseOptions,
	TriggerOptions,
	TruncateOptions,
} from '@riao/dbal';
import { SqliteBuilder } from './sql-builder';
import { SqliteQueryBuilder } from './query-builder';

export class SqliteDataDefinitionBuilder extends DataDefinitionBuilder {
	protected queryBuilderType = SqliteQueryBuilder;

	public constructor() {
		super();

		this.columnTypes = <any>{
			...this.columnTypes,
			INT: 'INTEGER',
			BIGINT: 'INTEGER',
		};
	}

	public disableForeignKeyChecks(): this {
		this.sql.append('PRAGMA foreign_keys = OFF');

		return this;
	}

	public enableForeignKeyChecks(): this {
		this.sql.append('PRAGMA foreign_keys = ON');

		return this;
	}

	public truncate(options: TruncateOptions): this {
		this.sql.append('DELETE FROM "' + options.table + '"; ');

		return this;
	}

	public createTablePrimaryKeys(names: string[]): this {
		return this;
	}

	public createTableColumn(column: ColumnOptions): this {
		if ((column as BaseIntColumnOptions).autoIncrement) {
			column.type = ColumnType.INT;
		}

		super.createTableColumn(column);

		return this;
	}

	public columnAutoIncrement(): this {
		this.sql.append('PRIMARY KEY ');

		return this;
	}

	protected getSqlType() {
		return SqliteBuilder;
	}

	public createDatabase(options: CreateDatabaseOptions): this {
		// TODO: Do this in the repo instead, and create the db file?
		return this;
	}

	public dropDatabase(options: DropDatabaseOptions): this {
		// TODO: Do this in the repo instead, and remove the db file?
		return this;
	}

	public addForeignKey(options: AddForeignKeyOptions): this {
		throw new Error(
			'Adding foreign key to an existing table is not supported by sqlite.'
		);
	}

	public alterColumnStatement(column: string): this {
		throw new Error(
			'Altering an existing column is not supported by sqlite.'
		);
	}

	public override createTrigger(options: TriggerOptions): this {
		if (options.event === 'INSERT' && options.timing === 'BEFORE') {
			options.timing = 'AFTER';
		}

		return super.createTrigger(options);
	}
}
