import * as React from 'react';
import { icons } from '@wbtdevlocal/assets';
import { SizedIcon } from '../icon/icon';
import { Paragraph } from '../text';
import { Spacing } from '../theme/box';
import { styled } from '../theme/styled';

export const ErrorGeneric: React.FC = () => {
	return (
		<Container>
			<RedErrorIcon size='medium' type={icons.statusErrorSolid} />
			<Paragraph>
				Data could not be retrieved.
			</Paragraph>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: flex-start;
	column-gap: ${Spacing.ant04};
`;

const RedErrorIcon = styled(SizedIcon)`
	color: ${p => p.theme.common.status.error};
`;