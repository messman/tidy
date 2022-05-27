import * as React from 'react';
import { Cosmos } from '@/test';
import { DefineProvider } from './define';

export const CosmosDefineProvider: React.FC = (props) => {
	const isDevelopment = Cosmos.useControlValue('Define - Is Development', true);

	return (
		<DefineProvider isDevelopment={isDevelopment}>
			{props.children}
		</DefineProvider>
	);
};