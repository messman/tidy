import * as React from 'react';
import { fontStyleDeclarations } from '@/core/text';
import { FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourString } from '@/services/time';

const LabelText = styled.div`
	${fontStyleDeclarations.bodySmall};
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