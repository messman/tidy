import * as React from 'react';
import { styled } from '@/core/style/styled';

interface PercentViewProps {
	visualHeightPercent: number,
	eventHeightPercent: number,
	height: number,
}

export const PercentView: React.FC<PercentViewProps> = (props) => {

	let { visualHeightPercent, eventHeightPercent, height } = props;
	let topPercent = -1;
	if (visualHeightPercent < .5) {
		topPercent = (1 - visualHeightPercent) * .5
	}
	else {
		topPercent = (visualHeightPercent * .5) + (1 - visualHeightPercent)
	}
	topPercent *= 100;

	const heightPercentText = `${Math.round(eventHeightPercent * 100)}% height`;


	return (
		<CenterPoint topPercent={topPercent}>
			<Container>
				<Backdrop />
				<Text>
					<div>{heightPercentText}</div>
					<div>{height} ft</div>

				</Text>
			</Container>
		</CenterPoint>
	);
}


/*
	TODO
	the height for the wave is for between previous and next... but we need to show min and max of the whole tides. But then text still needs to work the other way.

*/

interface CenterPointProps {
	topPercent: number
}

const CenterPoint = styled.div<CenterPointProps>`
	position: absolute;
	width: 1px;
	height: 1px;
	top: ${p => p.topPercent}%;
	left: 50%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Container = styled.div`
	position: relative;
`;

const Backdrop = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: ${p => p.theme.color.background};
	opacity: .3;
	border-radius: .25rem;
`;

const Text = styled.div`
	position: relative;
	padding: .5rem 1rem;
	color: ${p => p.theme.color.background};
	font-size: 2rem;
	text-align: center;
	font-weight: 400;
	opacity: .7
`;
