import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { SizedIcon } from '../icon/icon';
import { Spacing } from '../primitive/primitive-design';
import { MediumBodyText } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';

export const ErrorGeneric: React.FC = () => {
	return (
		<Container>
			<RedErrorIcon size='medium' type={icons.statusErrorSolid} />
			<MediumBodyText>
				Data could not be retrieved.
			</MediumBodyText>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: flex-start;
	column-gap: ${Spacing.ant04};
`;

const RedErrorIcon = styled(SizedIcon)`
	color: ${themeTokens.inform.unsure};
`;