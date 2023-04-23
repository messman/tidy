// import * as React from 'react';
// import styled from 'styled-components';
// import { Cosmos, CosmosFixture } from '@/test';
// import { FixtureContainer } from '@/test/cosmos-fixture';
// import { OutLink } from './link';
// import { fontStyleDeclarations } from './text';
// import { Block } from './theme/box';

// export default CosmosFixture.create(() => {

// 	const linkText = Cosmos.useControlValue('Link Text', 'Check it out');

// 	const linkTextRender = (
// 		<>
// 			This is a paragraph of long text. <OutLink href='https://google.com' title='Google'>{linkText}</OutLink> There is text above and
// 			below the links so that you can see how they look with the body text spacing.
// 			And so <OutLink href='https://google.com' title='Google'>{linkText}</OutLink> Hopefully everything looks good like this and there are no special adjustments to make.
// 			<a>This is a regular link.</a>
// 			Hopefully everything looks good like this and there are no special adjustments to make.
// 		</>
// 	);

// 	return (
// 		<>
// 			<Block.Dog16 />
// 			<BodyText>
// 				{linkTextRender}
// 			</BodyText>
// 			<Block.Dog16 />
// 			<BodySmallText>
// 				{linkTextRender}
// 			</BodySmallText>
// 			<Block.Dog16 />
// 			<LeadLargeText>
// 				{linkTextRender}
// 			</LeadLargeText>
// 			<Block.Dog16 />
// 			<LeadText>
// 				{linkTextRender}
// 			</LeadText>
// 			<Block.Dog16 />
// 			<LeadSmallText>
// 				{linkTextRender}
// 			</LeadSmallText>
// 			<Block.Dog16 />
// 			<SmallText>
// 				{linkTextRender}
// 			</SmallText>
// 			<Block.Dog16 />
// 			<TinyText>
// 				{linkTextRender}
// 			</TinyText>
// 			<Block.Dog16 />
// 			<CapitalText>
// 				{linkTextRender}
// 			</CapitalText>
// 		</>
// 	);
// }, {
// 	setup: fixtureDefault.docTwoPad
// });

// const LeadLargeText = styled.strong`
// 	${fontStyles.leadLarge};
// `;

// const LeadText = styled.strong`
// 	${fontStyles.lead};
// `;

// const LeadSmallText = styled.strong`
// 	${fontStyles.leadSmall};
// `;

// const BodyText = styled.span`
// 	${fontStyles.body};
// 	color: ${themeTokens.textSubtle};
// `;

// const BodySmallText = styled.span`
// 	${fontStyles.bodySmall};
// 	color: ${themeTokens.textSubtle};
// `;

// const SmallText = styled.span`
// 	${fontStyles.small};
// 	color: ${themeTokens.textSubtle};
// `;

// const CapitalText = styled.span`
// 	${fontStyles.capital};
// `;

// const TinyText = styled.span`
// 	${fontStyles.tiny};
// `;