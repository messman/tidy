import * as React from 'react';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { OpenSelectContainer, OpenSelectValue } from './open-select';

export default CosmosFixture.create(() => {

	const [selectedDataKey, setSelectedKey] = React.useState<string | number>('');

	function onSelectDataKey(key: string | number) {
		setSelectedKey(key);
	}

	return (
		<>
			<OpenSelectContainer selectedDataKey={selectedDataKey} onSelectDataKey={onSelectDataKey}>
				<OpenSelectValue dataKey={1} label='First Option' isDisabled={true} />
				<OpenSelectValue dataKey={2} label='Second Option' />
				<OpenSelectValue dataKey={3} label='Third Option' />
			</OpenSelectContainer>
		</>
	);
}, {
	setup: fixtureDefault.docTwoPad
});
