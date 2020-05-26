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

		// Filter down days to only those with tides, weather, and sun information.
		// Particularly weather, which is always in the future and so may not exist when we are on a day's 23rd hour.
		// Also, the weather we have for today doesn't make much sense if it's not using the whole day's data.
		// So for now - always exclude today.
		const validDays = days.filter((day) => {
			return !info.referenceTime.hasSame(day.date, 'day');
		});

		const tideHeightRange = tideExtremes.highest.height - tideExtremes.lowest.height;

		entries = validDays.map((day, i) => {
			const key = `forecast_${day.date.valueOf()}`;

			return (
				<ForecastEntry
					key={key}
					isTomorrow={i === 0}
					day={day}
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
	/** Whether the entry is for tomorrow. */
	isTomorrow: boolean,
	/** The day data. */
	day: AllDailyDay,
	/** The container width, used for creating tide charts. */
	containerWidth: number;
	/** Tallest tide height minus smallest tide height. */
	absoluteTideHeightRange: number;
}

const ForecastEntry: React.FC<ForecastContextBlockProps> = (props) => {
	const { isTomorrow, day } = props;

	let titleText = getDateDayOfWeek(day.date);
	if (isTomorrow) {
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

