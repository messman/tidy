import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Block } from '../layout/layout-shared';
import { MediumBodyText } from '../text/text-shared';
import { Toggle } from './toggle';

export default CosmosFixture.create(() => {

	const [value, setValue] = React.useState(true);

	return (
		<>
			<MediumBodyText>Value</MediumBodyText>
			<Toggle value={value} onToggle={() => { setValue(p => !p); }} />
			<Block.Dog16 />
			<Toggle value={true} onToggle={() => { }} />
			<Toggle value={false} onToggle={() => { }} />
		</>
	);
}, {
	setup: FixtureSetup.glass
});
