import * as React from 'react';
import { Text } from '@/core/text';
import { Cosmos, CosmosFixture } from '@/test';
import { Loading } from './loading';

export default CosmosFixture.create(() => {
	const isShowing = Cosmos.useControlValue('Is Showing', true);

	return (
		<Loading forceIsShowing={isShowing}>
			<Text>
				Here is some background text.
			</Text>
		</Loading>
	);
}, {
	hasMargin: true
});