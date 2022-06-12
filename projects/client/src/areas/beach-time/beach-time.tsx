import * as React from 'react';
import { SizedIcon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { PanelPadding } from '@/core/layout/panel/panel';
import { fontStyleDeclarations } from '@/core/text';
import { Block, borderRadiusStyle, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { BeachTimeBadges } from './beach-time-badges';
import { BeachTimeDays } from './beach-time-days';
import { BeachTimeDescription } from './beach-time-description';
import { BeachTimeRequirements } from './beach-time-requirements';
import { BeachTimeTitle } from './beach-time-title';

export const BeachTime: React.FC = () => {
	const { success } = useBatchResponse();

	if (!success) {
		return <SizedIcon size='medium' type={SpinnerIcon} />;
	}

	return (
		<>
			<PanelPadding>
				<BeachTimeTitle />
				<BeachTimeBadges />
				<BeachTimeDescription />
			</PanelPadding>
			<BeachTimeRequirements />
			<Block.Bat08 />
			<BeachTimeDays />
			<Block.Bat08 />
			<PanelPadding>
				<BeachTimeNote>
					"Beach time" is a subjective approximation based on available data for tides, sunlight, and weather (specifically, chance for rain or storms).
					Temperature is not considered. Data is not guaranteed accurate, and is less accurate the further it is based from the current time.
				</BeachTimeNote>
			</PanelPadding>
		</>
	);
};

const BeachTimeNote = styled.div`
	${fontStyleDeclarations.bodySmall};
	color: ${p => p.theme.textSubtle};
	padding: ${Spacing.dog16};
	background-color: ${p => p.theme.note.background};
	${borderRadiusStyle};
	border: 1px solid ${p => p.theme.note.outline};

`;