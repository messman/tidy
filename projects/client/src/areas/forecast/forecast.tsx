import * as React from 'react';
import { styled } from '@/core/style/styled';
import { Flex, FlexRow, FlexColumn } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { Subtitle, Text, TextInline, subtitleHeight } from '@/core/symbol/text';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { AllDailyDay } from 'tidy-shared';
import { DateTime } from 'tidy-shared/node_modules/@types/luxon';
import { getDateDayOfWeek } from '@/services/time';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';
import { ContextBlock } from '@/core/layout/context-block';
import { makeRect, createChartLine, Point } from '@/services/draw/bezier';
import { FillSVG, StrokeSVG } from '@/core/tide/tide-common';
import { processDailyWeatherForDisplay } from '@/services/weather/weather-process';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { useCurrentTheme } from '@/core/style/theme';

export interface ForecastProps {

}

export const Forecast: React.FC<ForecastProps> = () => {

	const allResponseState = useAllResponse();

	// Attach a ref to our title to get the width, which we use with all entries below.
	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout);

	console.log(size);
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const { all } = allResponseState.data!;
	let entries: JSX.Element[] = [];

	if (size.width > 1) {
		entries = all.daily.days.map((day, i) => {
			const key = `forecast_${day.date.valueOf()}`;

			return (
				<ForecastEntry
					key={key}
					isToday={i === 0}
					day={day}
					width={size.width}
				/>
			);
		});
	}

	return (
		<OverflowFlex>
			<Margin>
				<Subtitle ref={ref}>Daily Forecast</Subtitle>
			</Margin>
			{entries}
		</OverflowFlex>
	);
};

const OverflowFlex = styled(Flex)`
	overflow-y: auto;
`;

const Margin = styled.div`
	margin: ${edgePaddingValue};
`;

const PaddedText = styled(Text)`
	margin-bottom: .2rem;
`;

interface ForecastEntryProps {
	isToday: boolean,
	day: AllDailyDay<DateTime>,
	width: number
}

const ForecastEntry: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const { isToday, day } = props;

	let titleText = getDateDayOfWeek(day.date);
	if (isToday) {
		titleText = 'Today, ' + titleText;
	}

	return (
		<Margin>
			<PaddedText>{titleText}</PaddedText>
			<ContextBlock
				primary={(
					<ForecastEntryPrimary
						{...props}
					/>
				)}
				secondary={(
					<ForecastEntrySecondary
						{...props}
					/>
				)}
				isPadded={false}
			/>
		</Margin>
	)
}

interface ForecastEntryPrimaryProps extends ForecastEntryProps { }

const totalEntryHeight = 200;
const upperChartPaddingHeight = 50;
const lowerChartPaddingHeight = 60;


const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {

	const theme = useCurrentTheme();
	const { isToday, day } = props;

	let titleText = getDateDayOfWeek(day.date);
	if (isToday) {
		titleText = 'Today, ' + titleText;
	}

	const { events, highest, lowest, outsidePrevious, outsideNext } = day.tides;

	const allTides = [outsidePrevious, ...events, outsideNext];
	const points: Point[] = allTides.map(function (t) {
		return {
			x: t!.time.valueOf(),
			y: t!.height
		};
	});

	let min = lowest.height;
	let max = highest.height;

	const sourceRect = makeRect(day.date.startOf('day').valueOf(), min, day.date.endOf('day').valueOf(), max);

	const destRect = makeRect(0, 0, props.width, totalEntryHeight);

	const topPaddingFactor = upperChartPaddingHeight / totalEntryHeight;
	const bottomPaddingFactor = lowerChartPaddingHeight / totalEntryHeight;

	const output = createChartLine(points, sourceRect, destRect, bottomPaddingFactor, topPaddingFactor);
	const fillSVG = <FillSVG path={output.fillPath} destRect={destRect} />
	const strokeSVG = <StrokeSVG path={output.strokePath} destRect={destRect} />

	const { minTempText, maxTempText, chanceRainText, icon } = processDailyWeatherForDisplay(day.weather);

	return (
		<CenterSpacing>
			{fillSVG}
			{strokeSVG}
			<Margin>
				<FlexRow>
					<Flex>
						<Text>{maxTempText}&deg;/{minTempText}&deg;</Text>
					</Flex>
					<Flex>
						<Icon type={icon} fill={theme.color.weather} height={subtitleHeight} />
					</Flex>
					<Flex>
						<TextInline><Icon type={iconTypes.rain} fill={theme.color.weather} height={subtitleHeight} /> {chanceRainText}</TextInline>
					</Flex>
					<Flex>
						<Text>sunlight</Text>
					</Flex>
				</FlexRow>
			</Margin>
			<Flex />
			<Margin>
				<FlexRow>

					Lower
			</FlexRow>
			</Margin>
		</CenterSpacing>
	);
};

const CenterSpacing = styled(FlexColumn)`
	width: 100%;
	height: ${totalEntryHeight}px;
`;

interface ForecastEntrySecondaryProps extends ForecastEntryProps { }

const ForecastEntrySecondary: React.FC<ForecastEntrySecondaryProps> = () => {
	return (
		<Subtitle>Hello</Subtitle>
	)
}