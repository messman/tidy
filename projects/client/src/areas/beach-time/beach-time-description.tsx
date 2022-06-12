import * as React from 'react';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { BeachTimeStatus, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourRange, getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeDescription: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);

	const range = iso.mapEnumValue(BeachTimeStatus, beachTimeStatusTimeRange, beachTimeStatus)(beach);
	const rangeRender = range ? (
		<TimeRange>{range}</TimeRange>
	) : null;

	return (
		<>
			{rangeRender}
			<Block.Bat08 />
			<Paragraph>
				Beach time should last for the next 15 minutes.
			</Paragraph>
		</>
	);
};

const beachTimeStatusTimeRange: Record<keyof typeof BeachTimeStatus, (beach: iso.Batch.BeachContent) => (string | JSX.Element | null)> = {
	current: (beach) => {
		return `Until ${getTimeTwelveHourString(beach.current!.stop)}`;
	},
	currentEndingSoon: (beach) => {
		return `Ends ${getTimeTwelveHourString(beach.current!.stop)}`;
	},
	nextSoon: (beach) => {
		return getTimeTwelveHourRange(beach.next.start, beach.next.stop);
	},
	nextLater: (beach) => {
		return getTimeTwelveHourRange(beach.next.start, beach.next.stop);
	},
	nextTomorrow: (beach) => {
		return (
			<>
				{getTimeTwelveHourRange(beach.next.start, beach.next.stop)} tomorrow
			</>
		);
	},
	other: () => null,
};

const TimeRange = styled.div`
	${fontStyleDeclarations.lead};
`;