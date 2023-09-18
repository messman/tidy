import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const UnitText = styled.div`
	${fontStyles.text.medium}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small}
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

export const NowWeatherVisibility: React.FC = () => {

	const { now } = useBatchResponseSuccess();
	const { visibility } = now.weather.current;

	/*
		#REF_VISIBILITY_MAX - if visibility is not provided, assume it is max
		(10km, or over 6 miles)
	*/

	const isFullVisibility = visibility === null || visibility >= 6;

	return (
		<FlexPanel title="Visibility">
			<Container>
				<TextContainer>
					<StatisticText>{visibility || 6}{isFullVisibility && '+'}</StatisticText>
					<UnitText>miles</UnitText>
				</TextContainer>
				{isFullVisibility && <DescriptionText>Completely clear.</DescriptionText>}
			</Container>
		</FlexPanel>
	);
};