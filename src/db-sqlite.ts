import { Database } from '@riao/dbal/database';
import { SqliteDriver } from './driver';
import { DatabaseEnvSqlite } from './env';
import { SqliteQueryRepository } from './query-repository';
import { SqliteDataDefinitionBuilder } from './ddl-builder';
import { SqliteQueryBuilder } from './query-builder';
import { SqliteSchemaQueryRepository } from './schema-query-repository';

export class DatabaseSqlite extends Database {
	driverType = SqliteDriver;
	envType = DatabaseEnvSqlite;

	queryRepositoryType = SqliteQueryRepository;
	schemaQueryRepositoryType = SqliteSchemaQueryRepository;

	ddlBuilderType = SqliteDataDefinitionBuilder;
	queryBuilderType = SqliteQueryBuilder;
}
