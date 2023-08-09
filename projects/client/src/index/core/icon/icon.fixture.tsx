import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { themeTokens } from '../theme/theme-root';
import { Icon } from './icon';

export default CosmosFixture.create(() => {

	const iconsToRender = [
		icons.statusCircle,
		icons.navigationDashboard,
		icons.actionClose,
		icons.weatherLightning,
		icons.statusErrorOutline
	];

	return (
		<>
			<div>
				{iconsToRender.map(icon => <IconColorSmall key={icon.iconName} type={icon} />)}
			</div>
			<div>
				{iconsToRender.map(icon => <IconColorLarge key={icon.iconName} type={icon} />)}
			</div>
		</>
	);
}, {
	setup: FixtureSetup.glass
});

const IconColor = styled(Icon)`
	color: ${themeTokens.rawColor.purple.distinct};
`;

const IconColorSmall = styled(IconColor)`
	width: 2rem;
	height: 2rem;
`;

const IconColorLarge = styled(IconColor)`
	height: 4rem;
	width: 4rem;
`;