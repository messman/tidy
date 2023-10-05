import * as React from 'react';
import styled, { css } from 'styled-components';
import { wrapForBatchLoad } from '@/index/core/data/batch-load-control';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { DefaultErrorLoad } from '@/index/core/data/loader';
import { Panel, SpacePanelEdge, SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { WeekDay } from './week-day';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: ${SpacePanelGridPadding.value};
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
`;

const buttonInactiveStyles = css`
	background-color: ${themeTokens.background.tint.medium};
	color: ${themeTokens.text.subtle};
`;

const buttonActiveStyles = css`
	background-color: ${themeTokens.background.tint.darkest};
`;

const Button = styled.div<{ $isActive: boolean; }>`
	display: inline-block;
	margin: 0;
	padding: .25rem .75rem;
	border: 0;
	border-radius: 2rem;
	background-color: ${themeTokens.background.tint.darkest};
	${fontStyles.text.medium}
	cursor: pointer;
	${p => p.$isActive ? buttonActiveStyles : buttonInactiveStyles}
`;

enum Section {
	weather,
	beach,
	tide
}

export const Week: React.FC = wrapForBatchLoad(DefaultErrorLoad, () => {
	const { week } = useBatchResponseSuccess();

	const [state, setState] = React.useState(() => {
		return new Set([Section.weather, Section.beach, Section.tide]);
	});

	const daysRender = week.days.map((day) => {
		return (
			<WeekDay
				key={day.day.valueOf()}
				day={day}
				isShowingWeather={state.has(Section.weather)}
				isShowingBeach={state.has(Section.beach)}
				isShowingTide={state.has(Section.tide)}
			/>
		);
	});

	function createToggleSection(section: Section) {
		return function () {
			setState((p) => {
				const newSet = new Set(p);
				if (newSet.has(section)) {
					newSet.delete(section);
					if (!newSet.size) {
						return p;
					}
				}
				else {
					newSet.add(section);
				}
				return newSet;
			});
		};
	}

	return (
		<Container>
			<Panel>
				<ButtonsContainer>
					<Button
						$isActive={state.has(Section.weather)}
						onClick={createToggleSection(Section.weather)}
					>
						Weather
					</Button>
					<Button
						$isActive={state.has(Section.beach)}
						onClick={createToggleSection(Section.beach)}
					>
						Beach
					</Button>
					<Button
						$isActive={state.has(Section.tide)}
						onClick={createToggleSection(Section.tide)}
					>
						Tides
					</Button>
				</ButtonsContainer>
			</Panel>
			{daysRender}
		</Container>
	);
});