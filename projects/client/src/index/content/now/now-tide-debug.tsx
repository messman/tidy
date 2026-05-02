import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { TideHeightTextUnit } from '../common/tide/tide-common';

export const NowTideDebug: React.FC = () => {
	const { now, meta } = useBatchResponseSuccess();
	const {
		wellsAstroComputed,
		combinedDifferenceFactor,
		portland,
		seaveyIsland,
	} = now.tide.source;


	function tideAtTime(height: number, time: DateTime): React.ReactNode {
		return (
			<>
				<TideHeightTextUnit height={height} precision={1} /> at <TimeTextUnit dateTime={time} />
			</>
		);
	}

	function tide(height: number): React.ReactNode {
		return (
			<>
				<TideHeightTextUnit height={height} precision={1} />
			</>
		);
	}

	return (
		<Panel title="Water Level - Debug">
			<Container>
				<SubsectionContainer>
					<Text>Used: {tide(now.tide.current.height)}</Text>
					<Text>Astro Computed: {tide(wellsAstroComputed.height)}</Text>
					<Text>Combined Factor: {combinedDifferenceFactor.toFixed(2)}</Text>
					<Text>Previous: {tideAtTime(wellsAstroComputed.previousExtreme.height, wellsAstroComputed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(wellsAstroComputed.nextExtreme.height, wellsAstroComputed.nextExtreme.time)}</Text>
				</SubsectionContainer>
				<SubsectionContainer>
					<Text>Portland Measurement: {tideAtTime(portland.waterLevel.height, portland.waterLevel.time)}, {Math.round(meta.referenceTime.diff(portland.waterLevel.time, 'minutes').minutes)} minutes off</Text>
					<Text>Portland Prediction: {tide(portland.astroComputed.height)}</Text>
					<Text>Difference Factor: {portland.waterLevelDifferenceFactor.toFixed(2)}</Text>
					<Text>Previous: {tideAtTime(portland.astroComputed.previousExtreme.height, portland.astroComputed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(portland.astroComputed.nextExtreme.height, portland.astroComputed.nextExtreme.time)}</Text>
				</SubsectionContainer>
				<SubsectionContainer>
					<Text>Seavey Island Measurement: {tideAtTime(seaveyIsland.waterLevel.height, seaveyIsland.waterLevel.time)}, {Math.round(meta.referenceTime.diff(seaveyIsland.waterLevel.time, 'minutes').minutes)} minutes off</Text>
					<Text>Seavey Island Prediction: {tide(seaveyIsland.astroComputed.height)}</Text>
					<Text>Difference Factor: {seaveyIsland.waterLevelDifferenceFactor.toFixed(2)}</Text>
					<Text>Previous: {tideAtTime(seaveyIsland.astroComputed.previousExtreme.height, seaveyIsland.astroComputed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(seaveyIsland.astroComputed.nextExtreme.height, seaveyIsland.astroComputed.nextExtreme.time)}</Text>
				</SubsectionContainer>
			</Container>
		</Panel>
	);
};

const Container = styled.div`
	padding: ${SpacePanelEdge.value};
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const SubsectionContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .125rem;
`;

const Text = styled.div`
	${fontStyles.text.mediumRegular};
`;