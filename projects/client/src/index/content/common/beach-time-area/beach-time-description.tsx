import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { Block } from '@/index/core/layout/layout-shared';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { mapNumberEnumValue } from '@wbtdevlocal/iso';
import { BeachTimeContextualStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from './beach-time-utility';

export const BeachTimeDescription: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = mapNumberEnumValue(BeachTimeContextualStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
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
			<MediumBodyText>
				{description}
			</MediumBodyText>
		</>
	);
};

const TimeRange = styled.div`
	${fontStyles.lead.medium};
`;