import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroSolarEventType } from '@wbtdevlocal/iso';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const RowContainer = styled.div`
	display: flex;
	gap: .5rem;
`;

const BarTextContainer = styled.div`
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

const RiseSetIconContainer = styled.div`
	width: 3.25rem;
	height: 3.25rem;
	border-radius: ${borderRadiusSmallerValue};
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: .25rem;
`;

const RiseSetIcon = styled(Icon)`
	width: 2.25rem;
	height: 2.25rem;
	color: ${themeTokens.content.sun};
`;

export const NowAstroSun: React.FC = () => {

	const { now, getSolarEventById } = useBatchResponseSuccess();
	const { nextRiseSetIdsForDay, today, tomorrow } = now.astro.sun;

	/*
		Scenarios:
		1. Currently before sunrise - show sunrise and sunset (day)
		2. Currently before sunset - show sunset and next sunrise (sun is disappearing for awhile)
		3. After sunset - show next sunrise and previous sunset.
	*/
	const mainRiseSetId = nextRiseSetIdsForDay.length ? nextRiseSetIdsForDay[0] : tomorrow.riseId;
	const [secondaryRiseSetId, isInPast] = (() => {
		if (nextRiseSetIdsForDay.length === 2) {
			return [nextRiseSetIdsForDay[1], false];
		}
		if (nextRiseSetIdsForDay.length === 1) {
			return [tomorrow.riseId, false];
		}
		return [today.setId, true];
	})();

	const mainRiseSet = getSolarEventById(mainRiseSetId);
	const secondaryRiseSet = getSolarEventById(secondaryRiseSetId);

	const description = isInPast ? (
		<>
			{secondaryRiseSet.type === AstroSolarEventType.rise ? 'Sunrise' : 'Sunset'} was at <TimeTextUnit dateTime={secondaryRiseSet.time} />.
		</>
	) : (
		<>
			Next {secondaryRiseSet.type === AstroSolarEventType.rise ? 'sunrise' : 'sunset'} at <TimeTextUnit dateTime={secondaryRiseSet.time} />.
		</>
	);

	const isRise = mainRiseSet.type === AstroSolarEventType.rise;
	const containerBackground = isRise ? themeTokens.solar.riseGradient : themeTokens.solar.setGradient;

	return (
		<FlexPanel title="Sunrise & Sunset">
			<Container>
				<RowContainer>
					<RiseSetIconContainer
						style={{ background: containerBackground }}
					>
						<RiseSetIcon type={isRise ? icons.astroSunrise : icons.astroSundown} />
					</RiseSetIconContainer>
					<BarTextContainer>
						<StatisticText><TimeTextUnit dateTime={mainRiseSet.time} /></StatisticText>
						<TitleText>{isRise ? 'Sunrise' : 'Sunset'}</TitleText>
					</BarTextContainer>
				</RowContainer>
				<DescriptionText>{description}</DescriptionText>
			</Container>
		</FlexPanel>
	);
};