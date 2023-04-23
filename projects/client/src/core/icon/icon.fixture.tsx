import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { icons, SVGIconUrl } from '@wbtdevlocal/assets';
import { MediumBodyText } from '../text';
import { themeTokens } from '../theme/theme-root';
import { Icon, SizedIcon } from './icon';
import { SpinnerIcon } from './icon-spinner';

export default {
	'Customization': CosmosFixture.create(() => {

		const showUrlIcons = Cosmos.useControlValue('Show URL Icons', true);

		return (
			<>
				<MediumBodyText>URL (toggle show/hide to test reload)</MediumBodyText>
				<div>
					{showUrlIcons && <RedSmallIcon type={SVGIconUrl.actionCheck} />}
					{showUrlIcons && <RedSmallIcon type={SVGIconUrl.actionCheck} />}
				</div>
				<div>
					{showUrlIcons && <SizedIcon size='medium' type={SVGIconUrl.actionAdd} />}
				</div>
				<MediumBodyText>Regular</MediumBodyText>
				<div>
					<RedSmallIcon type={icons.statusCircle} />
				</div>
				<div>
					<RedLargeIcon type={icons.statusCircle} />
				</div>
				<div>
					<RedLargeIcon type={SpinnerIcon} />
					<SizedIcon type={SpinnerIcon} size='medium' />
					<SizedIcon type={SpinnerIcon} size='small' />
				</div>
			</>
		);
	}, {
		setup: fixtureDefault.docPad
	}),
	'URL Load': CosmosFixture.create(() => {

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
		setup: fixtureDefault.docPad
	})
};

const RedIcon = styled(Icon)`
	color: ${themeTokens.rawColor.red.distinct};
`;

const RedSmallIcon = styled(RedIcon)`
	width: 2rem;
	height: 2rem;
`;

const RedLargeIcon = styled(RedIcon)`
	height: 4rem;
	width: 4rem;
`;