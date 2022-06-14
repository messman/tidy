import * as React from 'react';
import { About } from '@/areas/about/about';
import { BeachTime } from '@/areas/beach-time/beach-time';
import { Conditions } from '@/areas/conditions/conditions';
import { Education } from '@/areas/education/education';
import { Tide } from '@/areas/tide/tide';
import { overflowHiddenScrollStyle } from '@/core/layout/layout';
import { Panel } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { WideAppHeader } from './app-header';

export const WideApplicationLayout: React.FC = () => {
	return (
		<AppContainer>
			<AppHeaderContainer>
				<WideAppHeader />
			</AppHeaderContainer>
			<WideContainer>
				<PanelScroller>
					<Panel>
						<BeachTime />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<Conditions />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<Tide />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<Education />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<About />
					</Panel>
				</PanelScroller>
			</WideContainer>
		</AppContainer>
	);
};

const AppContainer = styled.div`
	flex: 1;
	position: relative;
	${overflowHiddenScrollStyle};
`;

const AppHeaderContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	padding: ${Spacing.cat12} ${Spacing.dog16};
`;

const WideContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	gap: ${Spacing.cat12};
	padding: 0 ${Spacing.cat12}; // Only on the sides - other padding is handled with the scroller

	overflow-x: scroll;
`;

const PanelScroller = styled.div`
	flex-shrink: 0;
	overflow-y: scroll;
	width: 28rem; // What looks best, subjectively
	padding-top: 3rem; // Exactly the height of content + padding for AppHeader component
	padding-bottom: ${Spacing.cat12}; // Match the sides of the container
`;