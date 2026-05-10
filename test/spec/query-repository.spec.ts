import 'jasmine';
import { SqliteQueryBuilder } from '../../src/query-builder';
import { SqliteQueryRepository } from '../../src/query-repository';

describe('SqliteQueryRepository', () => {
	it('does not throw on null timestamp values', async () => {
		const repository = new SqliteQueryRepository({
			queryBuilderType: SqliteQueryBuilder,
		} as any);

		(repository as any).schema = {
			tables: {
				users: {
					columns: {
						createdAt: { type: 'TIMESTAMP' },
					},
				},
			},
		};

		const parentPrototype = Object.getPrototypeOf(
			SqliteQueryRepository.prototype
		);

		spyOn(parentPrototype, 'find').and.resolveTo([{ createdAt: null }] as any);

		await expectAsync(
			repository.find({ table: 'users' } as any)
		).toBeResolvedTo([{ createdAt: null }] as any);
	});
});
