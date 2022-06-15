import * as React from 'react';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeDescription: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { range, description } = textInfoFunc(beach, meta.referenceTime);

	const rangeRender = range ? (
		<>
			<TimeRange>{range}</TimeRange>
			<Block.Bat08 />
		</>
	) : null;

	return (
		<>
			{rangeRender}
			<Paragraph>
				{description}
			</Paragraph>
		</>
	);
};

const TimeRange = styled.div`
	${fontStyleDeclarations.lead};
`;