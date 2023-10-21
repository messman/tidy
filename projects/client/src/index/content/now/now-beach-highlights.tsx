import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { AstroSolarEventType, mapNumberEnumValue, TideLevelDirection, TideLevelDivision, TidePointCurrent, WeatherPointHourly, WeatherStatusType, WithDaytime } from '@wbtdevlocal/iso';
import { TideLevelIcon } from '../common/tide/tide-level-icon';
import { WeatherIconDayNight } from '../common/weather/weather-icon';
import { capitalizeFirst, weatherStatusDescription } from '../common/weather/weather-utility';

function getTideDescription(current: TidePointCurrent): string {
	const { direction, division } = current;
	if (direction === TideLevelDirection.turning) {
		return `It's ${division === TideLevelDivision.low ? 'low' : 'high'} tide`;
	}
	if (direction === TideLevelDirection.rising) {
		if (division === TideLevelDivision.high) {
			return `It's almost high tide`;
		}
		return division === TideLevelDivision.mid ? `The tide is rising` : `The tide is starting to rise`;
	}
	else {
		if (division === TideLevelDivision.low) {
			return `It's almost low tide`;
		}
		return division === TideLevelDivision.mid ? `The tide is falling` : `The tide is starting to fall`;
	}
}

const HighlightsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
`;

const IconWithTextContainer = styled.div`
	display: flex;
	gap: .5rem;
	align-items: start;
`;

const TallerText = styled.div`
	${fontStyles.text.medium};
	font-weight: ${FontWeight.regular};
	line-height: 2rem;
`;


export const NowBeachAccessHighlights: React.FC = () => {
	const { meta, now, getSolarEventById } = useBatchResponseSuccess();

	function renderIconWithText(icon: JSX.Element, text: React.ReactNode) {
		return (
			<IconWithTextContainer>
				{icon}
				<TallerText>{text}</TallerText>
			</IconWithTextContainer>
		);
	}

	const { tide, weather, astro } = now;

	const tideRender = renderIconWithText(
		<TideLevelIcon tide={tide.current} />,
		getTideDescription(tide.current)
	);

	let weatherInfoRender: React.ReactNode = null;

	const firstHourlyChangedIndicator = React.useMemo<WithDaytime<WeatherPointHourly> | null>(() => {
		if (!weather.indicatorChangeHourlyId) {
			return null;
		}
		const index = weather.hourly.findIndex((hourly) => hourly.id === weather.indicatorChangeHourlyId);
		return weather.hourly[index] as WithDaytime<WeatherPointHourly>;
	}, [weather.hourly, weather.indicatorChangeHourlyId]);

	if (firstHourlyChangedIndicator) {
		const isComingUp = !!firstHourlyChangedIndicator && firstHourlyChangedIndicator.time.diff(meta.referenceTime, 'hours').hours < 4;

		if (isComingUp) {
			const statusDescription = mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, firstHourlyChangedIndicator.status);

			weatherInfoRender = (
				<>
					{capitalizeFirst(statusDescription.futureConditions)} conditions in about <TimeDurationTextUnit startTime={meta.referenceTime} stopTime={firstHourlyChangedIndicator.time} />
				</>
			);
		}
	}

	let astroInfoRender: React.ReactNode = null;
	const solarEvent = astro.sun.currentId ? getSolarEventById(astro.sun.currentId) : null;
	if (solarEvent) {
		const typeToText: Record<keyof typeof AstroSolarEventType, string> = {
			civilDawn: 'Sun is rising soon',
			rise: 'The sun is rising',
			midday: 'Midday',
			set: 'The sun is setting',
			civilDusk: 'Losing light'
		};
		astroInfoRender = mapNumberEnumValue(AstroSolarEventType, typeToText, solarEvent.type);
	}
	else {
		const next = getSolarEventById(astro.sun.nextRiseSetTwilightId);
		const isComingUp = next.time.diff(meta.referenceTime, 'hours').hours < 2;
		if (isComingUp) {
			const typeToText: Record<keyof typeof AstroSolarEventType, React.ReactNode> = {
				civilDawn: 'Almost dawn',
				rise: 'Almost sunrise',
				midday: null,
				set: 'Almost sunset',
				civilDusk: 'Almost dusk'
			};
			astroInfoRender = mapNumberEnumValue(AstroSolarEventType, typeToText, next.type);
		}
	}

	let weatherAstroRender: JSX.Element | null = null;
	if (weatherInfoRender || astroInfoRender) {
		let infoRender: React.ReactNode = null;
		if (weatherInfoRender && astroInfoRender) {
			infoRender = (
				<>{weatherInfoRender}; {astroInfoRender}</>
			);
		}
		else {
			infoRender = weatherInfoRender || astroInfoRender;
		}
		weatherAstroRender = renderIconWithText(
			<WeatherIconDayNight isDay={weather.current.isDaytime} rain={0} status={weather.current.status} />,
			infoRender
		);
	}

	return (
		<Panel>
			<HighlightsContainer>
				{tideRender}
				{weatherAstroRender}
			</HighlightsContainer>
		</Panel>
	);
};