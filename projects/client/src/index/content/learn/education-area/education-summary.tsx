import * as React from 'react';
import styled from 'styled-components';
import { Block } from '@/index/core/layout/layout-shared';
import { Panel } from '@/index/core/layout/panel/panel';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';

export const EducationSummary: React.FC = () => {


	return (
		<Panel>
			<TitleText>
				How do tides work?
			</TitleText>
			<Block.Bat08 />
			<MediumBodyText>
				Learn more about the processes that create the tides you experience.
			</MediumBodyText>
		</Panel>
	);
};

const TitleText = styled.div`
	${fontStyles.headings.h4};
`;

