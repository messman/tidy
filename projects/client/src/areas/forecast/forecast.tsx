import * as React from 'react';
import { AllDailyDay } from 'tidy-shared';
import { ContextBlock } from '@/core/layout/context-block';
import { Flex } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { Subtitle, Text } from '@/core/symbol/text';
import { CONSTANT } from '@/services/constant';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { useElementSize } from '@/services/layout/element-size';
import { getDateDayOfWeek } from '@/services/time';
import { DailyWeatherDisplay, processDailyWeatherForDisplay } from '@/services/weather/weather-process';
import { useComponentLayout } from '../layout/component-layout';
import { ForecastEntryPrimary, ForecastEntrySecondary } from './forecast-entry';

export interface ForecastProps {

}

export const Forecast: React.FC<ForecastProps> = () => {

	const allResponseState = useAllResponse();
	// TODO - rethink this logic. We set it up such that forecast/settings would always be rendered, but here we essentially turn that off. Maybe use z-indexing instead of display: none?
	const [componentLayout] = useComponentLayout();

	// Attach a ref to our title to get the width, which we use with all entries below. NOTE - this is kind of messy logic. See other TODO about fixing this.
	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, [
		// Additional dependencies to control when we should check for size - special case. See the TODO above.
		componentLayout.isCompactForecastView,
		allResponseState.data
	]);

	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const { all, info } = allResponseState.data!;


	let entries: JSX.Element[] = [];

	if (size.width > 1) {
		const { tideExtremes, days } = all.daily;

		const tideHeightRange = tideExtremes.highest.height - tideExtremes.lowest.height;

		const today = info.referenceTime.startOf('day');
		const tomorrow = today.plus({ days: 1 });

		entries = days.map((day) => {
			const key = `forecast_${day.date.valueOf()}`;

			const isToday = day.date.hasSame(today, 'day');
			const isTomorrow = day.date.hasSame(tomorrow, 'day');

			return (
				<ForecastEntry
					key={key}
					isToday={isToday}
					isTomorrow={isTomorrow}
					day={day}
					dailyWeatherDisplay={processDailyWeatherForDisplay(day.weather)}
					containerWidth={size.width}
					absoluteTideHeightRange={tideHeightRange}
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

// Pad the text for the day so that it's a tiny bit easier to read.
const PaddedText = styled(Text)`
	margin-top: 1rem;
	margin-bottom: .3rem;
`;

export interface ForecastContextBlockProps {
	/** Whether the entry is for today. */
	isToday: boolean;
	/** Whether the entry is for tomorrow. */
	isTomorrow: boolean;
	/** The day data. */
	day: AllDailyDay;
	/** weather data, ready for output. */
	dailyWeatherDisplay: DailyWeatherDisplay;
	/** The container width, used for creating tide charts. */
	containerWidth: number;
	/** Tallest tide height minus smallest tide height. */
	absoluteTideHeightRange: number;
}

const ForecastEntry: React.FC<ForecastContextBlockProps> = (props) => {
	const { isToday, isTomorrow, day } = props;

	let titleText = getDateDayOfWeek(day.date);
	if (isToday) {
		titleText = 'Today, ' + titleText;
	}
	else if (isTomorrow) {
		titleText = 'Tomorrow, ' + titleText;
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
				isDualMode={false}
			/>
		</Margin>
	);
};

