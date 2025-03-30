import { DatabaseRecord } from '@riao/dbal/record';
import { InsertOneOptions, QueryRepository, SelectQuery } from '@riao/dbal/dml';

export class SqliteQueryRepository<
	T extends DatabaseRecord = DatabaseRecord
> extends QueryRepository<T> {
	public async insertOne(
		insertOptions: InsertOneOptions<T>
	): Promise<Partial<T>> {
		const result = await super.insertOne(insertOptions);

		if (insertOptions.primaryKey) {
			return <any>{
				[insertOptions.primaryKey]: result.lastInsertRowid,
			};
		}
		else {
			return null;
		}
	}

	public async find(selectQuery: SelectQuery<T>): Promise<T[]> {
		const results = await super.find(selectQuery);

		const tableSchema =
			selectQuery.table && typeof selectQuery.table === 'string'
				? this.schema?.tables[selectQuery.table]
				: null;

		if (tableSchema) {
			for (let i = 0; i < results.length; i++) {
				const result = results[i];

				for (const key in result) {
					const keySchema = tableSchema.columns[key];

					if (
						keySchema &&
						(keySchema.type === 'TIMESTAMP' ||
							keySchema.type === 'DATE')
					) {
						let val: string = <any>result[key];

						if (!val.includes('Z')) {
							val += 'Z';
						}

						results[i][key] = <any>new Date(val);
					}
				}
			}
		}

		return results;
	}
}
