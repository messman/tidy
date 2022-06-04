import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { icons, SVGIconTypeName } from '@wbtdevlocal/assets';
import { styled } from '../theme/styled';
import { Icon, SizedIcon } from './icon';
import { SpinnerIcon } from './icon-spinner';

export default CosmosFixture.create(() => {

	return (
		<>
			<div>
				<RedSmallIcon type={SVGIconTypeName.actionCheck} />
			</div>
			<div>
				<SizedIcon size='medium' type={SVGIconTypeName.decorationLike} />
			</div>
			<div>
				<RedSmallIcon type={icons.arrowRight} />
			</div>
			<div>
				<RedLargeIcon type={icons.navigationHome} />
			</div>
			<div>
				<RedLargeIcon type={SpinnerIcon} />
				<SizedIcon type={SpinnerIcon} size='medium' />
				<SizedIcon type={SpinnerIcon} size='small' />
			</div>
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});

const RedIcon = styled(Icon)`
	color: ${p => p.theme.common.system.red.a_main};
`;

const RedSmallIcon = styled(RedIcon)`
	width: 2rem;
	height: 2rem;
`;

const RedLargeIcon = styled(RedIcon)`
	height: 4rem;
	width: 4rem;
`;