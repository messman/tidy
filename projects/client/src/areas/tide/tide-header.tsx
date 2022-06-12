import * as React from 'react';
import { IconTitle } from '@/core/layout/layout';
import { OutLink } from '@/core/link';
import { Note } from '@/core/note';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { TideLevelIcon } from '@/core/tide/tide-level-icon';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourString, percentTimeBetween } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const TideHeader: React.FC = () => {
	const { meta, tide } = useBatchResponse().success!;
	const { measured, relativity } = tide;
	const { current: currentExtreme, next, previous } = relativity;

	let title: string = null!;
	if (currentExtreme) {
		title = `It's ${currentExtreme.isLow ? 'low' : 'high'} tide.`;
	}
	else {
		// [0-100]
		const timePercent = percentTimeBetween(meta.referenceTime, previous.time, next.time);
		if (timePercent >= 80) {
			title = `It's almost ${next.isLow ? 'low' : 'high'} tide.`;
		}
		else {
			title = `The tide is ${measured.direction === iso.Tide.Direction.falling ? 'falling' : (measured.direction === iso.Tide.Direction.rising ? 'rising' : 'turning')}.`;
		}
	}

	let noteRender: JSX.Element | null = null;
	if (currentExtreme) {
		let text = '';
		if (currentExtreme.isLow && measured.height < currentExtreme.height) {
			text = 'The measured water level is below the predicted low';
		}
		else if (!currentExtreme.isLow && measured.height > currentExtreme.height) {
			text = 'The measured water level is above the predicted high';
		}
		noteRender = (
			<>
				<Block.Bat08 />
				<Note>
					{text}, which may indicate adverse weather conditions.
				</Note>
			</>
		);
	}

	return (
		<>
			<IconTitle icon={<TideLevelIcon tide={measured} />}>{title}</IconTitle>
			<Block.Bat08 />
			<LeadText>
				Expecting a {next.isLow ? 'low' : 'high'} of <TideHeightTextUnit height={next.height} precision={1} /> at {getTimeTwelveHourString(next.time)}.
			</LeadText>
			<Block.Bat08 />
			<Paragraph>
				The water level is currently <TideHeightTextUnit height={measured.height} precision={1} /> above the average low.
				The beach is usually accessible at around <TideHeightTextUnit height={iso.constant.beachAccessHeight} precision={0} /> and below.
			</Paragraph>
			{noteRender}
			<Block.Bat08 />
			<Paragraph>
				Tide charts can be printed from <OutLink title='US Harbors' href="https://www.usharbors.com/harbor/maine/wells-harbor-me/tides/">US Harbors</OutLink>.
			</Paragraph>
		</>
	);
};

const LeadText = styled.div`
	${fontStyleDeclarations.lead};
`;
