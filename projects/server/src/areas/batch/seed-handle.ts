import { apiRoutes, Batch, isInNumberEnum } from '@wbtdevlocal/iso';
import { serverErrors } from '../../api/error';
import { route } from '../../api/wrap';
import { TestSeed } from '../../services/test/randomize';
import { readBatchWithSeed } from './batch-read';

export const routes = [
	route({
		route: apiRoutes.batch.seed,
		handler: async ({ ctx, params, ok }) => {
			const seed = params.path.seed;
			if (!seed) {
				return serverErrors.logic.missingParams(ctx, {
					publicDesc: 'seed is missing'
				});
			}
			if (!isInNumberEnum(Batch.Seed, seed)) {
				return serverErrors.logic.troubleParams(ctx, {
					publicDesc: 'seed value is not valid',
					hiddenLog: { seed }
				});
			}
			const response = await readBatchWithSeed(ctx, seed as TestSeed);
			ctx.logger.info('Seed', { seed });
			return ok({
				batch: response
			});
		}
	}),
];