import 'jasmine';
import { ColumnType } from '@riao/dbal/column/column-type';
import type { QueryRepositoryOptions } from '@riao/dbal/dml/query-repository';
import { SqliteQueryBuilder } from '../../src/query-builder';
import { SqliteQueryRepository } from '../../src/query-repository';

describe('SqliteQueryRepository', () => {
	it('does not throw on null timestamp values', async () => {
		const options: QueryRepositoryOptions = {
			queryBuilderType: SqliteQueryBuilder,
		};
		const repository = new SqliteQueryRepository(options);

		repository.init({
			driver: {} as any,
			schema: {
				tables: {
					users: {
						name: 'users',
						type: 'table',
						columns: {
							createdAt: {
								name: 'createdAt',
								type: ColumnType.TIMESTAMP,
							},
						},
					},
				},
			},
		});

		const parentPrototype = Object.getPrototypeOf(
			SqliteQueryRepository.prototype
		);

		spyOn(parentPrototype, 'find').and.resolveTo([{ createdAt: null }] as any);

		await expectAsync(
			repository.find({ table: 'users' } as any)
		).toBeResolvedTo([{ createdAt: null }] as any);
	});
});
