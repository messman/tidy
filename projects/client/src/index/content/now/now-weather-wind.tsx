import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { keyForNumberEnumValue, WeatherWindDirection } from '@wbtdevlocal/iso';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const TopContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const TitleText = styled.div`
	${fontStyles.text.medium}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small};
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

const CompassContainer = styled.div`
	position: relative;
	width: 3.5rem;
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CompassRoseIcon = styled(Icon)`
	position: absolute;
	width: 3.5rem;
	aspect-ratio: 1;
	color: ${themeTokens.text.subtle};
`;

const CompassArrowContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
const CompassArrowIcon = styled(Icon)`
	height: 1.75rem;
`;

const oppositeWindDirection = {
	N: 'S',
	NNE: 'SSW',
	NE: 'SW',
	ENE: 'WSW',
	E: 'W',
	ESE: 'WNW',
	SE: 'NW',
	SSE: 'NNW',
	S: 'N',
	SSW: 'NNE',
	SW: 'NE',
	WSW: 'ENE',
	W: 'E',
	WNW: 'ESE',
	NW: 'SE',
	NNW: 'SSE'
} as const satisfies Record<keyof typeof WeatherWindDirection, keyof typeof WeatherWindDirection>;


export const NowWeatherWind: React.FC = () => {

	const { now } = useBatchResponseSuccess();
	const { wind, windDirection, windAngle } = now.weather.current;

	const windRounded = Math.round(wind);

	const windText = (() => {
		if (windRounded === 0) {
			return 'No significant wind.';
		}

		const windDirectionText = keyForNumberEnumValue(WeatherWindDirection, windDirection);
		const oppositeWindDirectionText = oppositeWindDirection[windDirectionText];
		const knots = Math.round((wind * 0.868976) * 10) / 10;

		return `${knots} knots from ${windDirectionText} to ${oppositeWindDirectionText}`;
	})();

	return (
		<FlexPanel title="Wind">
			<Container>
				<TopContainer>
					<TextContainer>
						<StatisticText>{windRounded.toString()}</StatisticText>
						<TitleText>mph</TitleText>
					</TextContainer>
					<CompassContainer>
						<CompassRoseIcon type={icons.windRose} />
						<CompassArrowContainer style={{ transform: `rotateZ(${windAngle}deg)` }}>
							<CompassArrowIcon type={icons.windArrow} />
						</CompassArrowContainer>
					</CompassContainer>
				</TopContainer>
				<DescriptionText>{windText}</DescriptionText>
			</Container>
		</FlexPanel>
	);
};