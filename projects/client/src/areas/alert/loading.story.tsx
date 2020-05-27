import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { Loading } from './loading';

export default { title: 'areas/alert' };

export const TestLoading = decorate(() => {

	return (
		<Loading forceIsShowing={true}>
			<Text>
				Here is some background text.
			</Text>
		</Loading>
	);
});