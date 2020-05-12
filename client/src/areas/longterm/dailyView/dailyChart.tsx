import * as React from 'react';
import { styled, StyledFC, css } from '@/core/style/styled';
import { Point, createChartLine, ChartLineInput, makeRect, SVGPath } from '@/services/draw/bezier';
import { useElementSize } from '@/services/layout/element-size';
import { AllDailyDay } from 'tidy-shared';

interface DailyChartProps {
	minHour: number,
	maxHour: number,
	minTideHeight: number,
	maxTideHeight: number,
	dailyEvent: AllDailyDay
}

export const DailyChart: StyledFC<DailyChartProps> = (props) => {
	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, 300);

	let fillSVG: JSX.Element | null = null;
	let strokeSVG: JSX.Element | null = null;

	const goodSize = size.width > 1 && size.height > 1
	if (goodSize) {

		const tides = props.dailyEvent.tides;
		const day = props.dailyEvent.date;

		const startTime = new Date(day);
		startTime.setHours(props.minHour, 0, 0, 0);

		const endTime = new Date(day);
		endTime.setHours(props.maxHour, 0, 0, 0);

		const points: Point[] = tides.events.map(function (tide) {
			return {
				x: tide.time.getTime(),
				y: tide.height
			}
		});

		const chartLineInput: ChartLineInput = {
			points: points,
			closePath: true,
			sourceRect: makeRect(startTime.getTime(), props.minTideHeight, endTime.getTime(), props.maxTideHeight),
			destRect: makeRect(0, 0, size.width, size.height),
		};
		const fill = createChartLine(chartLineInput);
		fillSVG = <FillSVG path={fill.path} destRect={chartLineInput.destRect} />

		chartLineInput.closePath = false;
		const stroke = createChartLine(chartLineInput);
		strokeSVG = <StrokeSVG path={stroke.path} destRect={chartLineInput.destRect} />
	}


	return (
		<Container>
			<UpperPadding />
			<Sizer ref={ref} />
			<LowerPadding showGradient={goodSize} />
			{fillSVG}
			{strokeSVG}
		</Container>
	);
}

const Container = styled.div`
	position: relative;
`;

const Sizer = styled.div`
	height: 6rem;
`;

const FillSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${p => p.theme.color.background};
	opacity: .5;

	z-index: 5;
`;

const StrokeSVG = styled(SVGPath)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	stroke: ${p => p.theme.color.background};
	stroke-width: 12px;
	fill: transparent;

	z-index: 7;
`;

// Problem - for this and the other chart line, the only reason we can stroke outside of the svg container onto the padding elements is because the SVGs are overlaid and actually much larger.
// They are constrained by their size but absolutely positions at 50%, vertically centered. So I can't make this upper padding less without making the lower padding less.
const paddingHeightStyle = css`
	height: 1.5rem;
`;

const UpperPadding = styled.div`
	${paddingHeightStyle};
`;

interface LowerPaddingProps {
	showGradient: boolean
}

const LowerPadding = styled.div<LowerPaddingProps>`
	${paddingHeightStyle};
	opacity: .5;

	${p => p.showGradient && css`
		background-image: linear-gradient(180deg, ${p => p.theme.color.background} 10%, ${p => p.theme.color.background} 100%);
	`}
`;