import {
	BaseIntColumnOptions,
	ColumnOptions,
	ColumnType,
	CreateDatabaseOptions,
	DataDefinitionBuilder,
	DropDatabaseOptions,
} from '@riao/dbal';
import { SqliteBuilder } from './sql-builder';

export class SqliteDataDefinitionBuilder extends DataDefinitionBuilder {
	public constructor() {
		super();

		this.columnTypes = <any>{
			...this.columnTypes,
			INT: 'INTEGER',
			BIGINT: 'INTEGER',
		};
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
}
