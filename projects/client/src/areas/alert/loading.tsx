import * as React from 'react';
import { Flex, FlexColumn } from '@/core/layout/flex';
import { Overlay } from '@/core/layout/overlay';
import { addPadding, edgePaddingValue } from '@/core/style/common';
import { keyframes, styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Subtitle } from '@/core/symbol/text';
import { useAllResponse } from '@/services/data/data';
import { PopupType, usePopup } from './popup';

export interface LoadingProps {
	forceIsShowing?: boolean;
}

/**
 * Loading component will render over the top of any content and show a loading animation.
 */
export const Loading: React.FC<LoadingProps> = (props) => {

	const { isRunning, error } = useAllResponse();
	const theme = useCurrentTheme();
	const setPopup = usePopup()[1];

	let loadingBody: JSX.Element | null = null;
	const isOverlayActive = isRunning || !!props.forceIsShowing;

	// If the application set a pop-up...
	if (isOverlayActive) {

		const { tide, sun, weather, context } = theme.color;
		const colorOrder = [tide, sun, weather, context];
		const loadingDots = colorOrder.map((color, i) => {

			const invertedIndex = (colorOrder.length - 1) - i;

			return (
				<LoadingDot
					key={i}
					dotColor={color}
					index={invertedIndex}
				/>
			);
		});

		/*
			Structure:
			- Outer FlexColumn that centers each row and spaces them apart evenly.
				- A main body that is sized by its contents.
				- A Flex element with flex=0 that is essentially invisible.. but combined with space-evenly, pushes up the body to be in the upper section of the screen instead of exactly centered.
		*/
		loadingBody = (
			<FlexColumn alignItems='center' justifyContent='space-evenly'>
				<LoadingBody flex='none'>
					<PaddedSubtitle>Loading</PaddedSubtitle>
					<div>
						{loadingDots}
					</div>
				</LoadingBody>
				<Flex flex='none' />
			</FlexColumn>
		);
	}

	// TODO - this does not belong here.
	React.useEffect(() => {
		if (!isRunning && !!error) {
			setPopup({
				type: PopupType.error,
				title: 'Could Not Load Data',
				text: 'The application failed to load the data needed to show tide and weather information. Please wait a bit and then reload the page.',
				forceDataRefresh: false,
				forcePageReload: true
			});
		}
	}, [isRunning, error]);

	return (
		<Overlay isActive={isOverlayActive} backdropOpacity={1} component={loadingBody}>
			{props.children}
		</Overlay>
	);
};

const PaddedSubtitle = addPadding(Subtitle, edgePaddingValue);

const LoadingBody = styled(Flex)`
	/* Prevents crazy resizing scenarios. */
	min-width: 16rem;
	max-width: 24rem;
	margin: ${edgePaddingValue};
	text-align: center;
`;

const delay = .16;

const scale = keyframes`
	0%, 80%, 100% { 
		transform: scale(0);
	}
	40% { 
		transform: scale(1.0);
	}
`;

interface LoadingDotProps {
	dotColor: string;
	index: number;
}

const dotRadius = 6;

const LoadingDot = styled.div<LoadingDotProps>`
	display: inline-block;
	width: ${dotRadius * 2}px;
	height: ${dotRadius * 2}px;
	margin: 0 ${dotRadius}px;
	border-radius: 50%;
	background-color: ${p => p.dotColor};
	animation: ${scale} 1.5s infinite ease-in-out both;
	animation-delay: -${p => p.index * delay}s;
`;