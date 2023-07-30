import * as React from 'react';
import styled from 'styled-components';
import { FontWeight } from '@/core/primitive/primitive-design';
import { fontStyles } from '@/core/text';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourString } from '@/services/time';

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