import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { getTimeTwelveHourString } from '@/index/core/time/time';

const LabelText = styled.div`
	${fontStyles.text.small};
	color: #FFF;
	font-weight: ${FontWeight.medium};
`;

export const AppInfo: React.FC = () => {
	const { success } = useBatchResponse();

	let timeRender = success ? (
		<>
			&nbsp;&middot; as of {getTimeTwelveHourString(success.meta.referenceTime)}
		</>
	) : null;

	return (
		<LabelText>
			Wells, Maine
			{timeRender}
		</LabelText>
	);
};