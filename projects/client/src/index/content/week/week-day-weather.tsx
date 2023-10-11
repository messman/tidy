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
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { WeatherIconDayNight } from '../common/weather/weather-icon';
import { WeatherTempBar } from '../common/weather/weather-temp-bar';

const WeatherTempContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1.5rem;
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

	const { minTemp, maxTemp, status } = day.weather;

	const roundedLow = Math.round(minTemp);
	const roundedHigh = Math.round(maxTemp);

	return (
		<Panel
			title={isTop ? getDateLong(day.day, meta.referenceTime) : undefined}
			croppedTop={!isTop}
			croppedBottom={!isBottom}
		>
			<Container>
				<WeatherTempContainer>
					<WeatherIconDayNight
						isDay={true}
						rain={null}
						status={status}
					/>
					<TempContainer>
						<Text>{roundedLow}&deg;</Text>
						<WeatherTempBarStretch
							value={isCurrentDay ? now.weather.current.temp : undefined}
							low={roundedLow}
							high={roundedHigh}
							max={week.tempRange.max}
							min={week.tempRange.min}
						/>
						<Text>{roundedHigh}&deg;</Text>
					</TempContainer>
				</WeatherTempContainer>
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