import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit } from '@/index/core/text/text-unit';
import { TideLevelBeachStatus } from '@wbtdevlocal/iso';

const LargeText = styled.div`
	${fontStyles.stylized.statistic};
`;

export const NowBeachAccess: React.FC = () => {
	const { meta, now } = useBatchResponseSuccess();

	const { beachStatus, beachChange } = now.tide.current;
	let render: JSX.Element = null!;

	const timeDuration = (
		<LargeText>
			<TimeDurationTextUnit startTime={meta.referenceTime} stopTime={beachChange} />
		</LargeText>
	);

	if (beachStatus === TideLevelBeachStatus.covering) {
		render = (
			<>
				<MediumBodyText>The tide is covering up the last of the beach...</MediumBodyText>
				{timeDuration}
				<MediumBodyText>until the beach begins to uncover again</MediumBodyText>
			</>
		);
	}
	else if (beachStatus === TideLevelBeachStatus.covered) {
		render = (
			<>
				{timeDuration}
				<MediumBodyText>until the beach begins to uncover again</MediumBodyText>
			</>
		);
	}
	else if (beachStatus === TideLevelBeachStatus.uncovering) {
		render = (
			<>
				<MediumBodyText>The beach is gradually uncovering...</MediumBodyText>
				{timeDuration}
				<MediumBodyText>until the tide covers the beach again</MediumBodyText>
			</>
		);
	}
	else if (beachStatus === TideLevelBeachStatus.uncovered) {
		render = (
			<>
				{timeDuration}
				<MediumBodyText>until the tide covers the beach again</MediumBodyText>
			</>
		);
	}

	return (
		<Panel>
			<PanelPadding>
				{render}
			</PanelPadding>
		</Panel>
	);
};