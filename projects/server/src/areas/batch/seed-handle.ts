import * as iso from '@wbtdevlocal/iso';
import { serverErrors } from '../../api/error';
import { route } from '../../api/wrap';
import { TestSeed } from '../../services/test/randomize';
import { readBatchWithSeed } from './batch-read';

export const routes = [
	route(iso.apiRoutes.batch.seed.read)
		(async (ctx, params, _req, _res) => {
			const seed = params.path.seed;
			if (!seed) {
				return serverErrors.logic.missingParams(ctx, {
					publicDesc: 'seed is missing'
				});
			}
			if (!iso.isInEnum(iso.Batch.Seed, seed)) {
				return serverErrors.logic.troubleParams(ctx, {
					publicDesc: 'seed value is not valid',
					hiddenLog: { seed }
				});
			}
			const response = readBatchWithSeed(ctx, seed as TestSeed);
			ctx.logger.info('Seed', { seed });
			return response;
		}),
];