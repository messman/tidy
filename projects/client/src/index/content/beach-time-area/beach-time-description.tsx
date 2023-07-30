import * as React from 'react';
import styled from 'styled-components';
import { Block } from '@/core/layout';
import { fontStyles, MediumBodyText } from '@/core/text';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeDescription: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapNumberEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
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