import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { AboutIcon } from './about-icon';

export default CosmosFixture.create(() => {
	return (
		<div>
			<AboutIcon />
			<HalfOpacity>
				<AboutIcon />
			</HalfOpacity>
			<HalfOpacityBackground>
				<AboutIcon />
			</HalfOpacityBackground>
		</div>
	);
}, {
	setup: FixtureSetup.root
});

const HalfOpacity = styled.div`
	opacity: .99;
	padding: 3rem 0;
	background-color: #ffffff47;
`;

const HalfOpacityBackground = styled.div`
	opacity: .5;
	background-color: lightblue;
	padding: 3rem 0;
`;