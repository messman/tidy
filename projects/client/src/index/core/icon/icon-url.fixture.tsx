import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { SVGIconUrl } from '@wbtdevlocal/assets';
import { MediumBodyText } from '../text/text-shared';
import { SizedIcon } from './icon';

export default CosmosFixture.create(() => {

	const iconsToLoad = Object.keys(SVGIconUrl).map(x => SVGIconUrl[x as keyof typeof SVGIconUrl]);

	function createIcons() {
		return iconsToLoad.map((iconUrl) => {
			return <SizedIcon key={iconUrl} size='medium' type={iconUrl} />;
		});
	}

	const showUrlIcons = Cosmos.useControlValue('Show URL Icons', true);

	const icons1 = showUrlIcons ? createIcons() : null;
	const icons2 = showUrlIcons ? createIcons() : null;

	return (
		<>
			<MediumBodyText>Toggle show/hide to test reload and caching</MediumBodyText>
			<MediumBodyText>{iconsToLoad.length} icons</MediumBodyText>
			<div>
				{icons1}
			</div>
			<div>
				{icons2}
			</div>
		</>
	);
}, {
	setup: FixtureSetup.glass
});
