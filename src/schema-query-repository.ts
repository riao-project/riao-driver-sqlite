import {
	ColumnOptions,
	ColumnType,
	DatabaseRecord,
	SchemaQueryRepository,
} from '@riao/dbal';
import { SqliteBuilder } from './sql-builder';

export class SqliteSchemaQueryRepository extends SchemaQueryRepository {
	protected tablesTable = 'sqlite_schema';
	protected columnsTable = 'sqlite_schema';

	protected databaseNameColumn = '';
	protected tableNameColumn = 'tbl_name';
	protected tableTypeColumn = 'type';
	protected columnNameColumn = 'name';
	protected columnTypeColumn = 'type';
	protected columnPositionColumn = 'cid';

	protected returnedTableTypes: Record<any, 'table' | 'view'> = {
		table: 'table',
		view: 'view',
	};

	public getSqlType() {
		return SqliteBuilder;
	}

	protected getTablesQueryWhere() {
		return { type: 'table' };
	}

	protected async getColumnsQuery(table: string): Promise<DatabaseRecord[]> {
		const { results } = await this.driver.query({
			sql: 'PRAGMA table_info("' + table + '")',
		});

		return results;
	}

	protected getColumnsResultParser(options: {
		records: DatabaseRecord[];
		primaryKey: string;
	}): ColumnOptions[] {
		const results = super.getColumnsResultParser(options).map((column) => {
			let type: string = column.type;
			const typeParenthesisIndex = column.type.indexOf('(');

			if (typeParenthesisIndex > 0) {
				type = type.substring(0, typeParenthesisIndex);
			}

			const typeSpaceIndex = type.indexOf(' ');

			if (typeSpaceIndex > 0) {
				type = type.substring(0, typeSpaceIndex);
			}

			column.type = <ColumnType>type;

			return column;
		});

		return results;
	}

	protected async getPrimaryKeyQuery(
		table: string
	): Promise<null | DatabaseRecord> {
		const results = await this.getColumnsQuery(table);

		for (const col of results) {
			if (col?.pk) {
				return { name: col.name };
			}
		}

		return null;
	}
}
