import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { themeTokens } from '../theme/theme-root';
import { Icon, SizedIcon } from './icon';
import { SpinnerIcon } from './icon-spinner';

export default CosmosFixture.create(() => {

	return (
		<>
			<div>
				<LargeColorIcon type={SpinnerIcon} />
				<SizedIcon type={SpinnerIcon} size='medium' />
				<SizedIcon type={SpinnerIcon} size='small' />
			</div>
		</>
	);
}, {
	setup: FixtureSetup.glass
});

const LargeColorIcon = styled(Icon)`
	color: ${themeTokens.rawColor.purple.distinct};
	height: 4rem;
	width: 4rem;
`;