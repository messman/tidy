import * as React from 'react';
import { styled } from '@/core/style/styled';
import { Flex } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { Subtitle, Text } from '@/core/symbol/text';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { AllDailyDay } from 'tidy-shared';
import { getDateDayOfWeek } from '@/services/time';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';
import { ContextBlock } from '@/core/layout/context-block';
import { ForecastEntryPrimary, ForecastEntrySecondary } from './forecast-entry';

export interface ForecastProps {

}

export const Forecast: React.FC<ForecastProps> = () => {

	const allResponseState = useAllResponse();

	// Attach a ref to our title to get the width, which we use with all entries below.
	const ref = React.useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, CONSTANT.elementSizeLargeThrottleTimeout, null);

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
					containerWidth={size.width}
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

export interface ForecastContextBlockProps {
	isToday: boolean,
	day: AllDailyDay,
	containerWidth: number;
}

const ForecastEntry: React.FC<ForecastContextBlockProps> = (props) => {
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
	);
};

