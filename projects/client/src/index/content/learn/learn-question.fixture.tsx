import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap, SpacePanelGridListPadding } from '@/index/core/layout/layout-panel';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { LearnQuestion } from './learn-question';

export default CosmosFixture.create(() => {

	function onClick() {
		alert('Clicked');
	}

	return (
		<Container>
			<LearnQuestion onClick={onClick}>Is this the first one?</LearnQuestion>
			<LearnQuestion onClick={onClick}>What happens when we have quite a few words in here?</LearnQuestion>
			<LearnQuestion onClick={onClick}>Shorter one?</LearnQuestion>
		</Container>
	);
}, {
	setup: FixtureSetup.root
});

const Container = styled.div`
	padding: ${SpacePanelGridListPadding.value};
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;