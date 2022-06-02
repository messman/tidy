import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { OutLink } from './link';
import { fontStyleDeclarations } from './text';
import { Block } from './theme/box';
import { styled } from './theme/styled';

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
			<BodySmallText>
				{linkTextRender}
			</BodySmallText>
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
	hasMargin: true
});

const LeadLargeText = styled.strong`
	${fontStyleDeclarations.leadLarge};
`;

const LeadText = styled.strong`
	${fontStyleDeclarations.lead};
`;

const LeadSmallText = styled.strong`
	${fontStyleDeclarations.leadSmall};
`;

const BodyText = styled.span`
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textSubtle};
`;

const BodySmallText = styled.span`
	${fontStyleDeclarations.bodySmall};
	color: ${p => p.theme.textSubtle};
`;

const SmallText = styled.span`
	${fontStyleDeclarations.small};
	color: ${p => p.theme.textSubtle};
`;

const CapitalText = styled.span`
	${fontStyleDeclarations.capital};
`;

const TinyText = styled.span`
	${fontStyleDeclarations.tiny};
`;