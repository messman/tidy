import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Spacing } from '../primitive/primitive-design';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';

export default {
	'Block': CosmosFixture.create(() => {

		return (
			<>
				<SpacingEntry name='ant' size={Spacing.ant04} withColor={themeTokens.rawColor.blue.distinct} />
				<SpacingEntry name='bat' size={Spacing.bat08} withColor={themeTokens.rawColor.green.distinct} />
				<SpacingEntry name='cat' size={Spacing.cat12} withColor={themeTokens.rawColor.orange.distinct} />
				<SpacingEntry name='dog' size={Spacing.dog16} withColor={themeTokens.rawColor.purple.distinct} />
				<SpacingEntry name='elf' size={Spacing.elf24} withColor={themeTokens.rawColor.red.distinct} />
				<SpacingEntry name='fan' size={Spacing.fan32} withColor={themeTokens.rawColor.yellow.distinct} />
				<SpacingEntry name='guy' size={Spacing.guy40} withColor={themeTokens.rawColor.blue.distinct} />
				<SpacingEntry name='hut' size={Spacing.hut56} withColor={themeTokens.rawColor.green.distinct} />
				<SpacingEntry name='inn' size={Spacing.inn64} withColor={themeTokens.rawColor.orange.distinct} />
			</>
		);
	}, {
		setup: FixtureSetup.glass
	}),
};


interface SpacingEntryProps {
	name: string;
	size: string;
	withColor: string;
}

const SpacingEntry: React.FC<SpacingEntryProps> = (props) => {
	const { size, withColor, name } = props;

	return (
		<div>
			<CapitalText>{name}: {size}</CapitalText>
			<ColorBox name={name} size={size} withColor={withColor} />
		</div>
	);
};

const CapitalText = styled.p`
	${fontStyles.stylized.capitalized};
`;

const ColorBox = styled.div<SpacingEntryProps>`
	width: ${p => p.size};
	height: ${p => p.size};
	background-color: ${p => p.withColor};
	margin: ${p => p.size};
	margin: ${Spacing.dog16};
`;
