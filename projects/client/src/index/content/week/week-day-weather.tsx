import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getDateLong } from '@/index/core/time/time';
import { icons } from '@wbtdevlocal/assets';
import { BeachTimeDay, mapNumberEnumValue, WeatherStatusType } from '@wbtdevlocal/iso';
import { WeatherIcon, WeatherIconDayNight } from '../common/weather/weather-icon';
import { WeatherTempBar } from '../common/weather/weather-temp-bar';
import { capitalizeFirst, weatherStatusDescription } from '../common/weather/weather-utility';

const WeatherTempContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1.5rem;
`;

const WeatherTempIconsContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .5rem;
`;

const WeatherWarningIcon = styled(WeatherIcon)`
	color: ${themeTokens.inform.unsure};
`;

const TempContainer = styled.div`
	flex: 1;
	display: flex;
	gap: .75rem;
	align-items: center;
	justify-content: end;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelEdge.value};
`;

const Text = styled.div`
	${fontStyles.text.medium};
`;

const WeatherTempBarStretch = styled(WeatherTempBar)`
	flex: 1;
	max-width: 5rem; // Avoid excessive temp bar width
`;

const SunRiseSetEntry = styled.div`
	display: flex;
	align-items: center;
	gap: .25rem;
`;

const SunRiseSetContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

const SunRiseSetIcon = styled(Icon)`
	width: 1.5rem;
	height: 1.5rem;
	color: ${themeTokens.content.sun};
`;

export interface WeekDayWeatherProps {
	day: BeachTimeDay;
	isTop: boolean;
	isBottom: boolean;
};

export const WeekDayWeather: React.FC<WeekDayWeatherProps> = (props) => {
	const { day, isTop, isBottom } = props;
	const { meta, now, week, getSolarEventById } = useBatchResponseSuccess();

	const isCurrentDay = day.day.hasSame(meta.referenceTime, 'day');

	const { minTemp, maxTemp, status, pop } = day.weather;

	const roundedLow = Math.round(minTemp);
	const roundedHigh = Math.round(maxTemp);

	const { futureConditions, shouldUseCaution, isRainImplied } = mapNumberEnumValue(WeatherStatusType, weatherStatusDescription, status);

	const shouldUseCautionText = shouldUseCaution ? ' - use caution' : '';

	const popText = (() => {
		const roundedPercent = Math.round((pop * 100) / 5) * 5;

		if ((roundedPercent <= 5 || roundedPercent >= 95) && isRainImplied) {
			return null;
		}
		if (roundedPercent <= 0) {
			return ' No significant chance of precipitation for the day.';
		}
		return ` ${roundedPercent}% chance of precipitation for the day.`;
	})();

	// Only show the temp range when it's the only panel showing
	const isOnlyPanelShowing = isTop && isBottom;

	return (
		<Panel
			title={isTop ? getDateLong(day.day, meta.referenceTime) : undefined}
			croppedTop={!isTop}
			croppedBottom={!isBottom}
		>
			<Container>
				<WeatherTempContainer>
					<WeatherTempIconsContainer>
						<WeatherIconDayNight
							isDay={true}
							rain={null}
							status={status}
						/>
						{shouldUseCaution && <WeatherWarningIcon rain={0} type={icons.informWarningSolid} />}
					</WeatherTempIconsContainer>
					<TempContainer>
						<Text>{roundedLow}&deg;</Text>
						<WeatherTempBarStretch
							value={isCurrentDay ? now.weather.current.temp : undefined}
							low={roundedLow}
							high={roundedHigh}
							max={isOnlyPanelShowing ? week.tempRange.max : undefined}
							min={isOnlyPanelShowing ? week.tempRange.min : undefined}
						/>
						<Text>{roundedHigh}&deg;</Text>
					</TempContainer>
				</WeatherTempContainer>
				<Text>{capitalizeFirst(futureConditions)} conditions expected{shouldUseCautionText}.{popText}</Text>
				<SunRiseSetContainer>
					<SunRiseSetEntry>
						<SunRiseSetIcon type={icons.astroSunrise} />
						<Text>
							<TimeTextUnit
								dateTime={getSolarEventById(day.astro.sun.riseId).time}
							/>
						</Text>
					</SunRiseSetEntry>
					<SunRiseSetEntry>
						<SunRiseSetIcon type={icons.astroSundown} />
						<Text>
							<TimeTextUnit
								dateTime={getSolarEventById(day.astro.sun.setId).time}
							/>
						</Text>
					</SunRiseSetEntry>
				</SunRiseSetContainer>
			</Container>
		</Panel>
	);
};