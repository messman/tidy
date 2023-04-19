import * as React from 'react';
import styled, { css } from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { ellipsisStyle, fontStyleDeclarations } from './text';
import { Padding, Spacing } from './theme/box';

export default {
	'Text': CosmosFixture.create(() => {

		const bodyText = Cosmos.useControlValue('Body Text', 'Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out, and the car seemed to float in the middle of an immense dark sphere, whose upper half was strewn with silver. Looking down into the dark gulf below, I could see a ruddy light streaming through a rift in the clouds');

		return (
			<>
				<Display1>Display 1</Display1>
				<ComparedToBody />
				<Display2>Display 2</Display2>
				<ComparedToBody />
				<Heading1>Heading 1</Heading1>
				<ComparedToBody />
				<Heading2>Heading 2</Heading2>
				<ComparedToBody />
				<Heading3>Heading 3</Heading3>
				<ComparedToBody />
				<Heading4>Heading 4</Heading4>
				<ComparedToBody />
				<Heading5>Heading 5</Heading5>
				<ComparedToBody />
				<Heading6>Heading 6</Heading6>
				<ComparedToBody />
				<Padding.Dog16>
					<hr />
				</Padding.Dog16>
				<p>
					<LeadLargeText>This is the large lead text.</LeadLargeText>
				</p>
				<p>
					<LeadText>This is the lead text. It is stronger than the body text.</LeadText>
				</p>
				<p>
					<LeadSmallText>This is the small lead text.</LeadSmallText>
				</p>
				<p>
					<BodyText>Body: {bodyText}</BodyText>
				</p>
				<p>
					<BodySmallText>Small: {bodyText}</BodySmallText>
				</p>
				<p>
					<CapitalText>This is the capital text.</CapitalText>
				</p>
				<p>
					<TinyText>This is the tiny text.</TinyText>
				</p>
			</>
		);
	}, {
		container: FixtureContainer.panelPadding
	}),
	'Text Ellipses': CosmosFixture.create(() => {

		const textValue = Cosmos.useControlValue('Text', 'So here I am, just having a grand old time with some buddies, when all of a sudden');

		return (
			<>
				<LeadTextEllipses>(Lead) {textValue}</LeadTextEllipses>
				<BodyTextEllipses>(Body) {textValue}</BodyTextEllipses>
				<BodySmallTextEllipses>(Body Small) {textValue}</BodySmallTextEllipses>
				<CapitalTextEllipses>(Capital) {textValue}</CapitalTextEllipses>
			</>
		);
	}, {
		container: FixtureContainer.panelPadding
	})
};

const ComparedToBody: React.FC = () => {
	return (
		<BodyText>Compared to body text.</BodyText>
	);
};

const ellipsesStyles = css`
	${ellipsisStyle}
	margin: ${Spacing.dog16} 0;
`;

const LeadTextEllipses = styled.div`
	${fontStyleDeclarations.lead};
	${ellipsesStyles};
`;

const BodyTextEllipses = styled.div`
	${fontStyleDeclarations.body};
	${ellipsesStyles};
`;

const BodySmallTextEllipses = styled.div`
	${fontStyleDeclarations.bodySmall};
	${ellipsesStyles};
`;

const CapitalTextEllipses = styled.div`
	${fontStyleDeclarations.capital};
	${ellipsesStyles};
`;

const Display1 = styled.h1`
	${fontStyleDeclarations.display1};
`;

const Display2 = styled.h1`
	${fontStyleDeclarations.display2};
`;

const Heading1 = styled.h1`
	${fontStyleDeclarations.heading1};
`;

const Heading2 = styled.h2`
	${fontStyleDeclarations.heading2};
`;

const Heading3 = styled.h3`
	${fontStyleDeclarations.heading3};
`;

const Heading4 = styled.h4`
	${fontStyleDeclarations.heading4};
`;

const Heading5 = styled.h5`
	${fontStyleDeclarations.heading5};
`;

const Heading6 = styled.h6`
	${fontStyleDeclarations.heading6};
`;

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

// const SmallText = styled.span`
// 	${fontStyleDeclarations.small};
// 	color: ${p => p.theme.textSubtle};
// `;

const CapitalText = styled.span`
	${fontStyleDeclarations.capital};
`;

const TinyText = styled.span`
	${fontStyleDeclarations.tiny};
`;