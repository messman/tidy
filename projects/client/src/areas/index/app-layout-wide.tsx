import * as React from 'react';
import styled from 'styled-components';
import { About } from '@/areas/about/about';
import { BeachTime } from '@/areas/beach-time/beach-time';
import { Conditions } from '@/areas/conditions/conditions';
import { Education } from '@/areas/education/education';
import { Tide } from '@/areas/tide/tide';
import { SizedIcon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { Block, overflowHiddenScrollStyle } from '@/core/layout';
import { AppInfo } from '@/core/layout/app/app-info';
import { Panel } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/primitive/primitive-design';
import { useBatchResponse } from '@/services/data/data';
import { appHeaderHeight } from './app-layout-shared';

export const WideApplicationLayout: React.FC<React.PropsWithChildren> = () => {

	const { isLoading } = useBatchResponse();

	/*
		We show a spinner icon while loading and the time when we have data.
		When we have both, we show both. (For example, during a timer refresh.)
	*/
	const spinnerRender = isLoading ? (
		<>
			<Block.Ant04 />
			<AppHeaderSizedIcon size='small' type={SpinnerIcon} />
		</>
	) : null;

	return (
		<AppContainer>
			<AppHeaderContainer>
				<AppInfo />
				{spinnerRender}
			</AppHeaderContainer>
			<WideContainer>
				<PanelScroller>
					<Panel>
						<BeachTime />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<Tide />
					</Panel>
				</PanelScroller>
				<PanelScroller>
					<Panel>
						<Conditions />
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



const AppHeaderSizedIcon = styled(SizedIcon)`
	color: white;
`;

const AppHeaderContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: ${appHeaderHeight};
	display: flex;
	align-items: center;
	padding-left: ${Spacing.cat12};
`;

const AppContainer = styled.div`
	flex: 1;
	position: relative;
	${overflowHiddenScrollStyle};
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
	padding-top: ${appHeaderHeight}; // Exactly the height of content + padding for AppHeader component
	padding-bottom: ${Spacing.cat12}; // Match the sides of the container
`;