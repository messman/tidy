import { DateTime, DurationLikeObject } from 'luxon';
import * as React from 'react';
import { Paragraph } from '@/core/text';
import { TimeTextUnit } from '@/core/text-unit';
import { styled } from '@/core/theme/styled';
import { CosmosFixture } from '@/test';
import { getDurationDescription } from './time';

export default CosmosFixture.create(() => {

	const fromTime = DateTime.local();

	const durations: DurationLikeObject[] = [
		{ hours: 0, minutes: 15, seconds: 0 },
		{ hours: 0, minutes: 0, seconds: 9 },
		{ hours: 0, minutes: 0, seconds: 300 },
		{ hours: 0, minutes: 22, seconds: 0 },
		{ hours: 0, minutes: 46, seconds: 0 },
		{ hours: 0, minutes: 59, seconds: 0 },
		{ hours: 1, minutes: 3, seconds: 0 },
		{ hours: 1, minutes: 13, seconds: 0 },
		{ hours: 1, minutes: 58, seconds: 0 },
		{ hours: 2, minutes: 7, seconds: 0 },
		{ hours: 2, minutes: 27, seconds: 0 },
		{ hours: 2, minutes: 45, seconds: 0 },
		{ hours: 2, minutes: 57, seconds: 0 },
		{ hours: 3, minutes: 27, seconds: 0 },
		{ hours: 3, minutes: 45, seconds: 0 },
		{ hours: 3, minutes: 47, seconds: 0 },
		{ hours: 4, minutes: 20, seconds: 0 },
		{ hours: 4, minutes: 45, seconds: 0 },
		{ hours: 5, minutes: 27, seconds: 0 },
		{ hours: 5, minutes: 45, seconds: 0 },
		{ hours: 5, minutes: 55, seconds: 0 },
	];

	const durationRows = durations.map((duration, i) => {

		const durationString = `${duration.hours!.toString()}h ${duration.minutes!.toString()}m ${duration.seconds!.toString()}s`;
		const toTime = fromTime.plus(duration);
		const durationDescription = getDurationDescription(fromTime, toTime);
		return (
			<tr key={i}>
				<td>To: <TimeTextUnit dateTime={toTime} /></td>
				<td>{durationString}</td>
				<td>{durationDescription}</td>
			</tr>
		);
	});

	return (
		<>
			<Paragraph>From: <TimeTextUnit dateTime={fromTime} /></Paragraph>
			<StyledTable>
				<thead>
					<tr>
						<th>Time</th>
						<th>Duration</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{durationRows}
				</tbody>
			</StyledTable>
		</>
	);

}, {
	hasMargin: true
});

const StyledTable = styled.table`
	width: 50%;
	max-width: 800px;
	border-collapse: collapse;

	td {
		border: 1px solid ${p => p.theme.textDistinct};
		padding: .3rem;
	}
`;