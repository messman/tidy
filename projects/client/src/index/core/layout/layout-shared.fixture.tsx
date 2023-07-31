import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { Spacing } from '../primitive/primitive-design';
import { fontStyles, MediumBodyText } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { EdgeContainer } from './layout-shared';

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
		setup: FixtureSetup.root
	}),
	'Bleed': CosmosFixture.create(() => {

		return (
			<EdgeContainer>
				<MediumBodyText>Text here.</MediumBodyText>
				<div>
					<MediumBodyText>Text here.</MediumBodyText>
				</div>
				<MediumBodyText>Text here.</MediumBodyText>
			</EdgeContainer>
		);
	}, {
		setup: FixtureSetup.root
	}),
	'Stretch': CosmosFixture.create(() => {

		return (
			<Stretch_Container>
				<Stretch_Item remSize='1' />
				<Stretch_Item remSize='2' />
				<Stretch_Item remSize='3' />
			</Stretch_Container>
		);
	}, {
		setup: FixtureSetup.root
	})
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


const Stretch_Container = styled.div`
	display: flex;
	align-items: stretch;
	gap: 1rem;
`;

const Stretch_Item = styled.div<{ remSize: string; }>`
	flex: 1;
	width: ${p => p.remSize}rem;
	height: ${p => p.remSize}rem;
	background-color: red;
`;