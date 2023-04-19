import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { fontStyleDeclarations } from '../text';
import { Spacing } from './box';
import { Theme } from './color';

export default CosmosFixture.create(() => {

	return (
		<>
			<SpacingEntry name='ant' size={Spacing.ant04} pickColor={(t) => t.common.system.blue.a_main} />
			<SpacingEntry name='bat' size={Spacing.bat08} pickColor={(t) => t.common.system.green.a_main} />
			<SpacingEntry name='cat' size={Spacing.cat12} pickColor={(t) => t.common.system.orange.a_main} />
			<SpacingEntry name='elf' size={Spacing.elf24} pickColor={(t) => t.common.system.red.a_main} />
			<SpacingEntry name='fan' size={Spacing.fan32} pickColor={(t) => t.common.system.yellow.a_main} />
			<SpacingEntry name='guy' size={Spacing.guy40} pickColor={(t) => t.common.system.blue.a_main} />
			<SpacingEntry name='hut' size={Spacing.hut56} pickColor={(t) => t.common.system.green.a_main} />
			<SpacingEntry name='inn' size={Spacing.inn64} pickColor={(t) => t.common.system.orange.a_main} />
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});

interface SpacingEntryProps {
	name: string;
	size: string;
	pickColor: (t: Theme) => string;
}

const SpacingEntry: React.FC<SpacingEntryProps> = (props) => {
	const { size, pickColor, name } = props;

	return (
		<div>
			<CapitalText>{name}: {size}</CapitalText>
			<ColorBox name={name} size={size} pickColor={pickColor} />
		</div>
	);
};

const CapitalText = styled.p`
	${fontStyleDeclarations.capital};
`;

const ColorBox = styled.div<SpacingEntryProps>`
	width: ${p => p.size};
	height: ${p => p.size};
	background-color: ${p => p.pickColor(p.theme)};
	margin: ${p => p.size};
	margin: ${Spacing.dog16};
`;