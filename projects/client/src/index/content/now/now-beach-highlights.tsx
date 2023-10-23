import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroSolarEventType, mapNumberEnumValue, TideLevelBeachStatus, TideLevelDirection, TideLevelDivision, TidePointCurrent, WeatherStatusType } from '@wbtdevlocal/iso';
import { TideLevelIcon } from '../common/tide/tide-level-icon';
import { WeatherIcon, WeatherIconDayNight } from '../common/weather/weather-icon';
import { weatherStatusDescription } from '../common/weather/weather-utility';

export const NowBeachHighlights: React.FC = () => {
	const { meta, now, getSolarEventById } = useBatchResponseSuccess();

	const { tide, weather, astro } = now;

	const weatherCurrentStatusText = `It's ${mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, weather.current.status).nowItIs}`;

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
			textRender = current ? 'The sun is rising soon' : 'It\s almost dawn';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSunrise} />;
		}
		else if (type === AstroSolarEventType.rise) {
			textRender = current ? 'The sun is rising' : 'It\s almost sunrise';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSunrise} />;
		}
		// Skip mid-day
		else if (type === AstroSolarEventType.set) {
			textRender = current ? 'The sun is setting' : 'It\s almost sunset';
			iconRender = <WeatherSunIcon rain={0} type={icons.astroSundown} />;
		}
		else if (type === AstroSolarEventType.civilDusk) {
			textRender = current ? 'The sun has set' : 'It\'s almost dusk';
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
				{astroRender}
				<IconWithTextContainer>
					<WeatherIconDayNight isDay={weather.current.isDaytime} rain={0} status={weather.current.status} />
					<TallerText>{weatherCurrentStatusText}</TallerText>
				</IconWithTextContainer>
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

export const NowBeachHighlightsTide: React.FC = () => {
	const { meta, now } = useBatchResponseSuccess();

	const { beachStatus, beachCycleNextBetween, direction } = now.tide.current;

	const tideDescription = getTideDescription(now.tide.current);
	/*
		See #REF_BEACH_CYCLE_NEXT_BETWEEN
	*/
	const hasNoReturnToBetween = beachCycleNextBetween === null;

	const currentStatusLine: string = (() => {
		if (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.rising) {
			return 'The tide is covering up the last of the beach' + (hasNoReturnToBetween ? ', but will start to fall again soon' : '');
		}
		else if (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.falling) {
			return 'The beach is gradually uncovering' + (hasNoReturnToBetween ? ', but will fully cover again soon' : '');
		}
		else return tideDescription;
	})();

	const nextStatusRender: React.ReactNode = (() => {
		if (hasNoReturnToBetween) {
			return null;
		}

		let untilText: string = null!;
		if (beachStatus === TideLevelBeachStatus.covered || (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.rising)) {
			// This is for coming back down. If currently rising, add "again" to make it clear we're coming back.
			untilText = 'until the beach begins to uncover' + (direction === TideLevelDirection.rising ? ' again' : '');
		}
		else if (beachStatus === TideLevelBeachStatus.uncovered || (beachStatus === TideLevelBeachStatus.between && direction === TideLevelDirection.falling)) {
			// This is for coming back up. If current falling, add "again" for same reason as above.
			untilText = 'until the tide gets close to the top of the beach' + (direction === TideLevelDirection.falling ? ' again' : '');
		}

		return (
			<>&mdash; <TimeDurationTextUnit startTime={meta.referenceTime} stopTime={beachCycleNextBetween} isPrecise={false} /> {untilText}</>
		);
	})();

	return (
		<TallerText>
			{currentStatusLine} {nextStatusRender}
		</TallerText>
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