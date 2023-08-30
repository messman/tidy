import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString, percentFromStartOfDay } from '@/index/core/time/time';
import { icons } from '@wbtdevlocal/assets';
import { AstroSolarEventType, BeachTimeDay, mapNumberEnumValue } from '@wbtdevlocal/iso';

const height = '1rem';

const Container = styled.div`
	position: relative;
	height: ${height};
	width: 100%;
	margin-bottom: .25rem;
`;

const IconContainer = styled.div`
	position: absolute;
	width: 0;
	top: 0;
	height: 100%;
	overflow: visible;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SunIcon = styled(Icon)`
	width: ${height};
	height: ${height};
	color: ${themeTokens.content.sun};
	flex-shrink: 0;
`;

const Dot = styled.div`
	width: .25rem;
	height: .25rem;
	background-color: ${themeTokens.content.sun};
	border-radius: 100%;
	flex-shrink: 0;
`;

const solarEventTypeIcon: Record<keyof typeof AstroSolarEventType, React.FC> = {
	civilDawn: () => <Dot />,
	rise: () => <SunIcon type={icons.weatherSunrise} />,
	midday: () => <Dot />,
	set: () => <SunIcon type={icons.weatherSundown} />,
	civilDusk: () => <Dot />
};

export interface ChartHourlySolarProps {
	day: BeachTimeDay;
}

export const ChartHourlySolar: React.FC<ChartHourlySolarProps> = (props) => {
	const { day } = props;
	const { getSolarEventById } = useBatchResponseSuccess();

	const sunDay = day.astro.sun;
	const startOfDay = day.day.startOf('day');

	const ids = [
		sunDay.civilDawnId,
		sunDay.riseId,
		sunDay.middayId,
		sunDay.setId,
		sunDay.civilDuskId
	];

	const iconsRender = ids.map((id) => {
		const solarEvent = getSolarEventById(id);
		const Component = mapNumberEnumValue(AstroSolarEventType, solarEventTypeIcon, solarEvent.type);

		return (
			<IconContainer
				key={id}
				style={{
					left: asPercentString(percentFromStartOfDay(solarEvent.time, startOfDay))
				}}
			>
				<Component />
			</IconContainer>
		);
	});

	return (
		<Container>
			{iconsRender}
		</Container>
	);
};