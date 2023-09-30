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
		portland,
		portlandAdjustment,
		computed,
		astroComputed,
		ofsInterval,
		ofsComputed,
		ofsEntryTimeUtc,
		ofsRetries,
		ofsStation,
		ofsOffset
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
					<Text>Final value: {tide(now.tide.current.height)}</Text>
					{portland && portlandAdjustment !== null && <Text>Portland: {tide(portlandAdjustment)} (raw {tide(portland.height)})</Text>}
					<Text>OFS: {tide(ofsInterval.height)} (interval data)</Text>
					<Text>OFS/Astro Computed: {tide(computed.height)}</Text>
				</SubsectionContainer>
				{portland && portlandAdjustment !== null && (
					<SubsectionContainer>
						<Text>Portland: {tideAtTime(portland.height, portland.time)}, {Math.round(meta.referenceTime.diff(portland.time, 'minutes').minutes)} minutes off</Text>
						<Text>Adjusted uses OFS/Astro Next/Prev</Text>
					</SubsectionContainer>
				)}
				<SubsectionContainer>
					<Text>OFS/Astro Computed: <TideHeightTextUnit height={computed.height} precision={1} /></Text>
					<Text>Previous: {tideAtTime(computed.previousExtreme.height, computed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(computed.nextExtreme.height, computed.nextExtreme.time)}</Text>
				</SubsectionContainer>

				<SubsectionContainer>
					<Text>Astro Computed: <TideHeightTextUnit height={astroComputed.height} precision={1} /></Text>
					<Text>Previous: {tideAtTime(astroComputed.previousExtreme.height, astroComputed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(astroComputed.nextExtreme.height, astroComputed.nextExtreme.time)}</Text>
				</SubsectionContainer>

				<SubsectionContainer>
					<Text>OFS Computed: <TideHeightTextUnit height={ofsComputed.height} precision={1} /></Text>
					<Text>Previous: {tideAtTime(ofsComputed.previousExtreme.height, ofsComputed.previousExtreme.time)}</Text>
					<Text>Next: {tideAtTime(ofsComputed.nextExtreme.height, ofsComputed.nextExtreme.time)}</Text>
				</SubsectionContainer>

				<SubsectionContainer>
					<Text>OFS Interval: {tideAtTime(ofsInterval.height, ofsInterval.time)}</Text>
					<Text>OFS Entry (UTC): {ofsEntryTimeUtc.toLocaleString(DateTime.DATETIME_SHORT)}</Text>
					<Text>OFS Entry (Local): {ofsEntryTimeUtc.setZone('local').toLocaleString(DateTime.DATETIME_SHORT)}</Text>
					<Text>OFS Retries: {ofsRetries.toString()}</Text>
					<Text>OFS Station: {ofsStation.lat}&deg; lat, {ofsStation.lon}&deg; lon</Text>
					<Text>OFS Station Distance: {ofsOffset.toString()} km</Text>
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