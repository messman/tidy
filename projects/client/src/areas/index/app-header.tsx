import * as React from 'react';
import { SizedIcon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { fontStyleDeclarations } from '@/core/text';
import { Block } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourString } from '@/services/time';

/*
	We show a spinner icon while loading and the time when we have data.
	When we have both, we show both. (For example, during a timer refresh.)
*/

export const WideAppHeader: React.FC = () => {
	const { isLoading } = useBatchResponse();

	const spinnerRender = isLoading ? (
		<>
			<Block.Ant04 />
			<AppHeaderSizedIcon size='small' type={SpinnerIcon} />
		</>
	) : null;

	return (
		<WideContainer>
			<AppHeaderLocationTime />
			{spinnerRender}
		</WideContainer>
	);
};


export const CompactAppHeader: React.FC = () => {
	return (
		<AppHeaderLocationTime />
	);
};

const WideContainer = styled.div`
	display: flex;
	align-items: center;
`;

const AppHeaderSizedIcon = styled(SizedIcon)`
	color: white;
`;

const LabelText = styled.div`
	${fontStyleDeclarations.bodySmall};
	color: #FFF;
	font-weight: ${FontWeight.medium};
`;

const AppHeaderLocationTime: React.FC = () => {
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

