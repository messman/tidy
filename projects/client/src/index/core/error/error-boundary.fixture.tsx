import { DateTime } from 'luxon';
import * as React from 'react';
import { Panel, PanelPadding, SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Button, ButtonFullWidthContainer } from '../form/button';
import { ErrorBoundary, ErrorBoundaryCover } from './error-boundary';

export default {
	'Error-triggered': CosmosFixture.create(() => {
		return (
			<ErrorBoundary>
				<ErrorCreator />
			</ErrorBoundary>
		);
	}, {
		setup: FixtureSetup.root,
	}),
	'Cover': CosmosFixture.create(() => {
		return (
			<ErrorBoundaryCover error={new Error('Test error')}>
				<p>No error</p>
			</ErrorBoundaryCover>
		);
	}, {
		setup: FixtureSetup.root,
	})
};


const ErrorCreator: React.FC = () => {

	const [willCreateError, setWillCreateError] = React.useState(false);
	const time: DateTime | null = null;

	if (willCreateError) {
		// Try to access something that doesn't exist (time is null)
		const x = time!.toISODate(); // Will throw error
		console.log(x);
	}

	return (
		<SpacePanelGridPadding.PadA>
			<Panel>
				<PanelPadding>
					<ButtonFullWidthContainer>
						{/* We can't throw an error here directly to trigger the boundary; have to cause it via rendering */}
						<Button onClick={() => { setWillCreateError(true); }}>Create an error</Button>
					</ButtonFullWidthContainer>
				</PanelPadding>
			</Panel>
		</SpacePanelGridPadding.PadA>
	);
};