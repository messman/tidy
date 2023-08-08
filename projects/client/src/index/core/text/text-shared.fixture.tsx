import * as React from 'react';
import styled, { css } from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Block } from '../layout/layout-shared';
import { Spacing } from '../primitive/primitive-design';
import { themeTokens } from '../theme/theme-root';
import { ellipsisStyle, FontDoc, fontStyleDefinitions, fontStyles } from './text-shared';

export default {
	'Text': CosmosFixture.create(() => {

		const bodyText = Cosmos.useControlValue('Body Text', 'Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out, and the car seemed to float in the middle of an immense dark sphere, whose upper half was strewn with silver. Looking down into the dark gulf below, I could see a ruddy light streaming through a rift in the clouds');

		return (
			<>
				<div>
					<DisplayHeavy>Display Heavy - {fontStyleDefinitions.display.heavy.size}</DisplayHeavy>
					<ComparedToBody />
					<DisplayLight>Display Light - {fontStyleDefinitions.display.light.size}</DisplayLight>
					<ComparedToBody />
					<Heading1>Heading 1 - {fontStyleDefinitions.headings.h1.size}</Heading1>
					<ComparedToBody />
					<Heading2>Heading 2 - {fontStyleDefinitions.headings.h2.size}</Heading2>
					<ComparedToBody />
					<Heading3>Heading 3 - {fontStyleDefinitions.headings.h3.size}</Heading3>
					<ComparedToBody />
					<Heading4>Heading 4 - {fontStyleDefinitions.headings.h4.size}</Heading4>
					<ComparedToBody />
					<Heading5>Heading 5 - {fontStyleDefinitions.headings.h5.size}</Heading5>
					<ComparedToBody />
					<Heading6>Heading 6 - {fontStyleDefinitions.headings.h6.size}</Heading6>
					<ComparedToBody />
				</div>
				<Block.Fan32 />
				<div>
					<LeadLargeText>Lead Large Text - {fontStyleDefinitions.lead.large.size}</LeadLargeText>
					<LeadMediumText>Lead Medium Text  - {fontStyleDefinitions.lead.medium.size}</LeadMediumText>
					<LeadSmallText>Lead Small Text  - {fontStyleDefinitions.lead.small.size}</LeadSmallText>
				</div>
				<Block.Fan32 />
				<p>
					<BodyText>Body: {bodyText}</BodyText>
				</p>
				<p>
					<BodySmallText>Small: {bodyText}</BodySmallText>
				</p>
				<p>
					<BlockquoteText>This is the blockquote text. It is stronger and larger.</BlockquoteText>
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
		setup: FixtureSetup.glass
	}),
	'Text Ellipses': CosmosFixture.create(() => {

		const textValue = Cosmos.useControlValue('Text', 'So here I am, just having a grand old time with some buddies, when all of a sudden');
		const remWidth = Cosmos.useControlValue('Width (rem)', 20);
		const remWidthValue = remWidth + 'rem';

		return (
			<EllipsesContainer $width={remWidthValue}>
				<LeadTextEllipses>(Lead) {textValue}</LeadTextEllipses>
				<BodyTextEllipses>(Body) {textValue}</BodyTextEllipses>
				<BodySmallTextEllipses>(Body Small) {textValue}</BodySmallTextEllipses>
				<CapitalTextEllipses>(Capital) {textValue}</CapitalTextEllipses>
			</EllipsesContainer>
		);
	}, {
		setup: FixtureSetup.glass
	}),
	'Text Hierarchy': CosmosFixture.create(() => {

		const isPage = Cosmos.useControlValue('Is Page', true);
		const Component = isPage ? FontDoc.A_PageTitle.Component : FontDoc.B_ViewTitle.Component;

		return (
			<div>
				<Component>{isPage ? 'Page' : 'View'} Title</Component>
				<FontDoc.C_Topic.Component>Topic A</FontDoc.C_Topic.Component>
				<FontDoc.D_Section.Component>Section A.A</FontDoc.D_Section.Component>
				<FontDoc.E_Paragraph.Component>
					Pizza ipsum dolor meat lovers buffalo. Lot sausage crust ham pineapple and. Tomatoes meat hand crust sautéed platter wing. Parmesan green dolor pesto sautéed. Tomatoes sauce tomatoes peppers tossed mayo pesto Philly.
					Fresh red pepperoni red sauce large burnt sauce. Extra string pork burnt banana Aussie fresh beef. Thin meat hand pizza string tomatoes. Sausage banana buffalo Chicago NY fresh garlic Aussie white steak.
					Style pepperoni pie lasagna broccoli. Wing hand chicken NY mayo sautéed Chicago. Large lot Hawaiian wing melted pizza bacon. Bbq olives ranch red beef banana thin Philly personal. Steak ipsum pesto meatball chicken cheese.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.E_Paragraph.Component>
					Meat beef pepperoni ipsum pork meat extra. Roll pizza sauce cheese deep Philly bacon. Hawaiian tomato burnt tossed Hawaiian large string crust. Bianca peppers melted chicken pork chicken meatball.
					Platter string NY style lasagna string white. Meatball tomatoes rib black tomato black ham. Meat fresh ranch mouth rib. Melted mouth dolor pesto pan anchovies meat platter peppers. Ricotta mozzarella sautéed red extra.
					Lot pizza Chicago pesto dolor. Mozzarella green extra broccoli burnt personal. Parmesan burnt hand onions bell onions banana. Large tossed dolor party bell style mayo mayo chicken rib.
					Ricotta Bianca platter broccoli fresh broccoli Bianca ham style. Sautéed sausage pesto Philly lasagna fresh.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.D_Section.Component>Section A.B</FontDoc.D_Section.Component>
				<FontDoc.E_Paragraph.Component>
					Pizza ipsum dolor meat lovers buffalo. Lot sausage crust ham pineapple and. Tomatoes meat hand crust sautéed platter wing. Parmesan green dolor pesto sautéed. Tomatoes sauce tomatoes peppers tossed mayo pesto Philly.
					Fresh red pepperoni red sauce large burnt sauce. Extra string pork burnt banana Aussie fresh beef. Thin meat hand pizza string tomatoes. Sausage banana buffalo Chicago NY fresh garlic Aussie white steak.
					Style pepperoni pie lasagna broccoli. Wing hand chicken NY mayo sautéed Chicago. Large lot Hawaiian wing melted pizza bacon. Bbq olives ranch red beef banana thin Philly personal. Steak ipsum pesto meatball chicken cheese.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.E_Paragraph.Component>
					Meat beef pepperoni ipsum pork meat extra. Roll pizza sauce cheese deep Philly bacon. Hawaiian tomato burnt tossed Hawaiian large string crust. Bianca peppers melted chicken pork chicken meatball.
					Platter string NY style lasagna string white. Meatball tomatoes rib black tomato black ham. Meat fresh ranch mouth rib. Melted mouth dolor pesto pan anchovies meat platter peppers. Ricotta mozzarella sautéed red extra.
					Lot pizza Chicago pesto dolor. Mozzarella green extra broccoli burnt personal. Parmesan burnt hand onions bell onions banana. Large tossed dolor party bell style mayo mayo chicken rib.
					Ricotta Bianca platter broccoli fresh broccoli Bianca ham style. Sautéed sausage pesto Philly lasagna fresh.
				</FontDoc.E_Paragraph.Component>

				<FontDoc.C_Topic.Component>Topic B</FontDoc.C_Topic.Component>
				<FontDoc.D_Section.Component>Section B.A</FontDoc.D_Section.Component>
				<FontDoc.E_Paragraph.Component>
					Pizza ipsum dolor meat lovers buffalo. Lot sausage crust ham pineapple and. Tomatoes meat hand crust sautéed platter wing. Parmesan green dolor pesto sautéed. Tomatoes sauce tomatoes peppers tossed mayo pesto Philly.
					Fresh red pepperoni red sauce large burnt sauce. Extra string pork burnt banana Aussie fresh beef. Thin meat hand pizza string tomatoes. Sausage banana buffalo Chicago NY fresh garlic Aussie white steak.
					Style pepperoni pie lasagna broccoli. Wing hand chicken NY mayo sautéed Chicago. Large lot Hawaiian wing melted pizza bacon. Bbq olives ranch red beef banana thin Philly personal. Steak ipsum pesto meatball chicken cheese.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.E_Paragraph.Component>
					Meat beef pepperoni ipsum pork meat extra. Roll pizza sauce cheese deep Philly bacon. Hawaiian tomato burnt tossed Hawaiian large string crust. Bianca peppers melted chicken pork chicken meatball.
					Platter string NY style lasagna string white. Meatball tomatoes rib black tomato black ham. Meat fresh ranch mouth rib. Melted mouth dolor pesto pan anchovies meat platter peppers. Ricotta mozzarella sautéed red extra.
					Lot pizza Chicago pesto dolor. Mozzarella green extra broccoli burnt personal. Parmesan burnt hand onions bell onions banana. Large tossed dolor party bell style mayo mayo chicken rib.
					Ricotta Bianca platter broccoli fresh broccoli Bianca ham style. Sautéed sausage pesto Philly lasagna fresh.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.D_Section.Component>Section B.B</FontDoc.D_Section.Component>
				<FontDoc.E_Paragraph.Component>
					Pizza ipsum dolor meat lovers buffalo. Lot sausage crust ham pineapple and. Tomatoes meat hand crust sautéed platter wing. Parmesan green dolor pesto sautéed. Tomatoes sauce tomatoes peppers tossed mayo pesto Philly.
					Fresh red pepperoni red sauce large burnt sauce. Extra string pork burnt banana Aussie fresh beef. Thin meat hand pizza string tomatoes. Sausage banana buffalo Chicago NY fresh garlic Aussie white steak.
					Style pepperoni pie lasagna broccoli. Wing hand chicken NY mayo sautéed Chicago. Large lot Hawaiian wing melted pizza bacon. Bbq olives ranch red beef banana thin Philly personal. Steak ipsum pesto meatball chicken cheese.
				</FontDoc.E_Paragraph.Component>
				<FontDoc.E_Paragraph.Component>
					Meat beef pepperoni ipsum pork meat extra. Roll pizza sauce cheese deep Philly bacon. Hawaiian tomato burnt tossed Hawaiian large string crust. Bianca peppers melted chicken pork chicken meatball.
					Platter string NY style lasagna string white. Meatball tomatoes rib black tomato black ham. Meat fresh ranch mouth rib. Melted mouth dolor pesto pan anchovies meat platter peppers. Ricotta mozzarella sautéed red extra.
					Lot pizza Chicago pesto dolor. Mozzarella green extra broccoli burnt personal. Parmesan burnt hand onions bell onions banana. Large tossed dolor party bell style mayo mayo chicken rib.
					Ricotta Bianca platter broccoli fresh broccoli Bianca ham style. Sautéed sausage pesto Philly lasagna fresh.
				</FontDoc.E_Paragraph.Component>
			</div>
		);
	}, {
		setup: FixtureSetup.glass
	})

};

const ComparedToBody: React.FC = () => {
	return (
		<BodyText>Compared to body text ({fontStyleDefinitions.text.medium.size}).</BodyText>
	);
};

interface EllipsesTextProps {
	$width: string;
}

const EllipsesContainer = styled.div<EllipsesTextProps>`
	background-color: ${themeTokens.background.glass};
	padding: ${Spacing.dog16};
	border: 1px solid ${themeTokens.text.subtle};
	width: ${p => p.$width};
`;

const ellipsesStyles = css`
	${ellipsisStyle}
`;

const LeadTextEllipses = styled.div`
	${fontStyles.lead.medium};
	${ellipsesStyles};
`;

const BodyTextEllipses = styled.div`
	${fontStyles.text.medium};
	${ellipsesStyles};
`;

const BodySmallTextEllipses = styled.div`
	${fontStyles.text.small};
	${ellipsesStyles};
`;

const CapitalTextEllipses = styled.div`
	${fontStyles.stylized.capitalized};
	${ellipsesStyles};
`;

const DisplayHeavy = styled.h1`
	${fontStyles.display.heavy};
`;

const DisplayLight = styled.h1`
	${fontStyles.display.light};
`;

const Heading1 = styled.h1`
	${fontStyles.headings.h1};
`;

const Heading2 = styled.h2`
	${fontStyles.headings.h2};
`;

const Heading3 = styled.h3`
	${fontStyles.headings.h3};
`;

const Heading4 = styled.h4`
	${fontStyles.headings.h4};
`;

const Heading5 = styled.h5`
	${fontStyles.headings.h5};
`;

const Heading6 = styled.h6`
	${fontStyles.headings.h6};
`;

const LeadLargeText = styled.p`
	${fontStyles.lead.large};
`;

const LeadMediumText = styled.p`
	${fontStyles.lead.medium};
`;

const LeadSmallText = styled.p`
	${fontStyles.lead.small};
`;

const BodyText = styled.p`
	${fontStyles.text.medium};
	color: ${themeTokens.text.subtle};
`;

const BodySmallText = styled.p`
	${fontStyles.text.small};
	color: ${themeTokens.text.subtle};
`;

// const SmallText = styled.p`
// 	${fontStyles.small};
// 	color: ${themeTokens.v4.text.subtle};
// `;

const BlockquoteText = styled.p`
	${fontStyles.stylized.blockquote};
`;

const CapitalText = styled.p`
	${fontStyles.stylized.capitalized};
`;

const TinyText = styled.p`
	${fontStyles.text.tiny};
`;
