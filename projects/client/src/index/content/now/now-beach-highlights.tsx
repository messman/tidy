import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import {
	AstroSolarEventType, mapNumberEnumValue, TideLevelBeachStatus, TideLevelDirection, TideLevelDivision, TidePointCurrent, WeatherPointHourly, WeatherStatusType, WithDaytime
} from '@wbtdevlocal/iso';
import { TideLevelIcon } from '../common/tide/tide-level-icon';
import { WeatherIcon, WeatherIconDayNight } from '../common/weather/weather-icon';
import { capitalizeFirst, weatherStatusDescription } from '../common/weather/weather-utility';

export const NowBeachHighlights: React.FC = () => {
	const { meta, now, getSolarEventById } = useBatchResponseSuccess();

	const { tide, weather, astro } = now;

	const weatherCurrentStatusText = capitalizeFirst(mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, weather.current.status).nowItIs);
	let weatherTextRender: React.ReactNode = <>{weatherCurrentStatusText}</>;

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

			weatherTextRender = (
				<>
					{weatherCurrentStatusText} &mdash; {statusDescription.futureConditions} conditions in <TimeDurationTextUnit startTime={meta.referenceTime} stopTime={firstHourlyChangedIndicator.time} isPrecise={false} />
				</>
			);
		}
	}

	const astroRender: React.ReactNode = (() => {

		let textRender: React.ReactNode = null;
		let iconRender: React.ReactNode = null;

		const current = astro.sun.currentId ? getSolarEventById(astro.sun.currentId) : null;
		const next = getSolarEventById(astro.sun.nextRiseSetTwilightId);
		const isNextSoon = next.time.diff(meta.referenceTime, 'hours').hours < 1;

		if (!current && (!next || !isNextSoon)) {
			return null;
		}

		const { type } = (current || next);

		if (type === AstroSolarEventType.civilDawn) {
			textRender = current ? 'Sun is rising soon' : 'Almost dawn';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSunrise} />;
		}
		else if (type === AstroSolarEventType.rise) {
			textRender = current ? 'Sun is rising' : 'Almost sunrise';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSunrise} />;
		}
		// Skip mid-day
		else if (type === AstroSolarEventType.set) {
			textRender = current ? 'Sun is setting' : 'Almost sunset';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSundown} />;
		}
		else if (type === AstroSolarEventType.civilDusk) {
			textRender = current ? 'Sun has set' : 'Almost dusk';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSundown} />;
		}

		if (!textRender || !iconRender) {
			return null;
		}

		return (
			<IconWithTextContainer>
				{iconRender}
				<TallerText>{textRender}</TallerText>
			</IconWithTextContainer>
		);
	})();

	return (
		<Panel>
			<HighlightsContainer>
				<IconWithTextContainer>
					<TideLevelIcon tide={tide.current} />
					<NowBeachHighlightsTide />
				</IconWithTextContainer>
				<IconWithTextContainer>
					<WeatherIconDayNight isDay={weather.current.isDaytime} rain={0} status={weather.current.status} />
					<TallerText>{weatherTextRender}</TallerText>
				</IconWithTextContainer>
				{astroRender}
			</HighlightsContainer>
		</Panel>
	);
};

const WeatherSunIcon = styled(WeatherIcon)`
	color: ${themeTokens.content.sun};
`;

const HighlightsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .75rem;
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
	padding-top: .25rem; // to make total height of one line align to icon
`;

const MediumText = styled.div`
	${fontStyles.text.mediumRegular};
	`;

const LargeBeachTideText = styled.div`
	${fontStyles.stylized.emphasis};
	margin-top: .25rem;
`;

export const NowBeachHighlightsTide: React.FC = () => {
	const { meta, now } = useBatchResponseSuccess();

	const { beachStatus, beachChange, direction } = now.tide.current;

	const timeDuration = (
		<LargeBeachTideText>
			<TimeDurationTextUnit startTime={meta.referenceTime} stopTime={beachChange} isPrecise={false} />
		</LargeBeachTideText>
	);

	const tideDescription = getTideDescription(now.tide.current);

	const [firstLine, secondLine] = (() => {

		if (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.rising) {
			return [
				'The tide is covering up the last of the beach',
				'until the beach begins to uncover again'
			];
		}
		else if (beachStatus === TideLevelBeachStatus.covered) {
			return [
				tideDescription,
				'until the beach begins to uncover'
			];
		}
		else if (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.falling) {
			return [
				'The beach is gradually uncovering',
				'until the tide covers the beach again'
			];
		}
		else if (beachStatus === TideLevelBeachStatus.uncovered) {
			return [
				tideDescription,
				'until the tide covers the beach'
			];
		}
		return null!; // Won't happen
	})();

	return (
		<div>
			<TallerText>{firstLine}...</TallerText>
			{timeDuration}
			<MediumText>{secondLine}</MediumText>
		</div>
	);
};

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