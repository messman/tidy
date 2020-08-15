import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { SmallText } from '@/core/symbol/text';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { Flex, FlexColumn, FlexRow } from '@messman/react-common';
import { SummaryAstro } from './summary-astro';
import { SummaryTide } from './summary-tide';
import { SummaryTideChart } from './summary-tide-chart';
import { SummaryTitle } from './summary-title';
import { SummaryWeather } from './summary-weather';

export interface SummaryProps {
	isCompactVertical: boolean;
}

export const Summary: React.FC<SummaryProps> = (props) => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return <Flex />;
	}

	const { isCompactVertical } = props;

	if (isCompactVertical) {
		return (
			<FlexColumn>
				<VerticalPadding />
				<VerticalContainer>
					<SummaryTitle showExpandedText={false} />
				</VerticalContainer>
				<VerticalPadding />
				<VerticalContainer>
					<SummaryTide isDualMode={false} />
				</VerticalContainer>
				<VerticalPadding />
				<VerticalContainer>
					<SummaryAstro isDualMode={false} />
				</VerticalContainer>
				<VerticalPadding />
				<VerticalContainer>
					<SummaryWeather isDualMode={false} />
				</VerticalContainer>
				<SummaryTideChart />
				<VerticalContainer>
					<CenterSmallText>Swipe right to left to see a full timeline.</CenterSmallText>
				</VerticalContainer>
				<VerticalPadding />
			</FlexColumn>
		);
	}

	return (
		<FlexRow flex='none'>
			<HorizontalPadding />
			<HorizontalPadding />
			<HorizontalContainer flex='none' alignItems='center' justifyContent='center'>
				<SummaryTitle showExpandedText={true} />
			</HorizontalContainer>
			<HorizontalPadding />
			<HorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<HorizontalContainer>
					<SummaryTide isDualMode={true} />
				</HorizontalContainer>
			</ExplicitWidthFlexColumn>
			<HorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<HorizontalContainer>
					<SummaryAstro isDualMode={true} />
				</HorizontalContainer>
			</ExplicitWidthFlexColumn>
			<HorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<HorizontalContainer>
					<SummaryWeather isDualMode={true} />
				</HorizontalContainer>
			</ExplicitWidthFlexColumn>
			<HorizontalPadding />

		</FlexRow >
	);
};

const HorizontalPadding = styled.div`
	width: ${edgePaddingValue};
	height: 1rem;
`;

const HorizontalContainer = styled(FlexColumn)`
	margin: ${edgePaddingValue} 0;
`;

const VerticalPadding = styled.div`
	height: ${edgePaddingValue};
	width: 1rem;
`;

const VerticalContainer = styled.div`
	margin: 0 ${edgePaddingValue};
`;

const CenterSmallText = styled(SmallText)`
	text-align: center;
`;

export const ExplicitWidthFlexColumn = styled(FlexColumn)`
	/* Close to optimal width used for designs. */
	width: 430px;
`;