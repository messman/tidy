import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Block } from '../layout/layout-shared';
import { themeTokens } from '../theme/theme-root';
import { OutLink } from './text-link';
import { fontStyles } from './text-shared';

export default CosmosFixture.create(() => {

	const linkText = Cosmos.useControlValue('Link Text', 'Check it out');

	const linkTextRender = (
		<>
			This is a paragraph of long text. <OutLink href='https://google.com' title='Google'>{linkText}</OutLink> There is text above and
			below the links so that you can see how they look with the body text spacing.
			And so <OutLink href='https://google.com' title='Google'>{linkText}</OutLink> Hopefully everything looks good like this and there are no special adjustments to make.
			<a>This is a regular link.</a>
			Hopefully everything looks good like this and there are no special adjustments to make.
		</>
	);

	return (
		<>
			<Block.Dog16 />
			<BodyText>
				{linkTextRender}
			</BodyText>
			<Block.Dog16 />
			<Block.Dog16 />
			<LeadLargeText>
				{linkTextRender}
			</LeadLargeText>
			<Block.Dog16 />
			<LeadText>
				{linkTextRender}
			</LeadText>
			<Block.Dog16 />
			<LeadSmallText>
				{linkTextRender}
			</LeadSmallText>
			<Block.Dog16 />
			<SmallText>
				{linkTextRender}
			</SmallText>
			<Block.Dog16 />
			<TinyText>
				{linkTextRender}
			</TinyText>
			<Block.Dog16 />
			<CapitalText>
				{linkTextRender}
			</CapitalText>
		</>
	);
}, {
	setup: FixtureSetup.root
});

const LeadLargeText = styled.strong`
	${fontStyles.lead.large};
`;

const LeadText = styled.strong`
	${fontStyles.lead.medium};
`;

const LeadSmallText = styled.strong`
	${fontStyles.lead.small};
`;

const BodyText = styled.span`
	${fontStyles.text.medium};
	color: ${themeTokens.text.subtle};
`;

const SmallText = styled.span`
	${fontStyles.text.small};
	color: ${themeTokens.text.subtle};
`;

const CapitalText = styled.span`
	${fontStyles.stylized.capitalized};
`;

const TinyText = styled.span`
	${fontStyles.text.tiny};
`;