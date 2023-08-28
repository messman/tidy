import * as React from 'react';
import styled from 'styled-components';
import { PanelPadded, PanelTitled, SpacePanelEdge, SpacePanelGridGap, SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';

export type NowBeachAccessHighlightsProps = {

};

/** */
export const NowBeachAccessHighlights: React.FC<NowBeachAccessHighlightsProps> = (props) => {
	const { } = props;

	return (
		null
	);
};


export type NowBeachUpcomingProps = {

};

/** */
export const NowBeachUpcoming: React.FC<NowBeachUpcomingProps> = (props) => {
	const { } = props;

	return (
		null
	);
};

const NowBeachHow_Title = styled.div`
	${fontStyles.stylized.capitalized};
	color: ${themeTokens.text.subtle};
`;

export type NowBeachHowProps = {

};

/** */
export const NowBeachHow: React.FC<NowBeachHowProps> = (props) => {
	const { } = props;

	return (
		<PanelPadded>
			<NowBeachHow_Title>How It Works &amp; Disclaimer</NowBeachHow_Title>
		</PanelPadded>
	);
};

const NowBeach_Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
	padding: ${SpacePanelGridPadding.value};
`;

export type NowBeachProps = {

};

/** */
export const NowBeach: React.FC<NowBeachProps> = (props) => {
	const { } = props;

	return (
		<NowBeach_Container>
			<NowBeachAccess />
			<NowBeachHow />
		</NowBeach_Container>
	);
};