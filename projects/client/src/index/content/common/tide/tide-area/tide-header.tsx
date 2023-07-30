import * as React from 'react';
import styled from 'styled-components';
import { Block } from '@/core/layout';
import { fontStyles, MediumBodyText, OutLink } from '@/core/text';
import { Note } from '@/core/text/note';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { TideLevelIcon } from '@/core/tide/tide-level-icon';
import { getTideTitle } from '@/services/content/tide-utility';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const TideHeader: React.FC = () => {
	const { meta, tide } = useBatchResponse().success!;
	const { measured, relativity } = tide;
	const { current: currentExtreme, next } = relativity;

	const title = getTideTitle(meta.referenceTime, measured, relativity);

	let noteRender: JSX.Element | null = null;
	if (currentExtreme) {
		let text = '';
		if (currentExtreme.isLow && measured.height < currentExtreme.height) {
			text = 'The measured water level is below the predicted low';
		}
		else if (!currentExtreme.isLow && measured.height > currentExtreme.height) {
			text = 'The measured water level is above the predicted high';
		}
		if (text) {
			noteRender = (
				<>
					<Block.Bat08 />
					<Note>
						{text}, which may indicate adverse weather conditions.
					</Note>
				</>
			);
		}
	}

	const portlandText = tide.measured.isAlternate ? (
		<MediumBodyText>
			Due to station availability issues, the current water level measurement is from Portland and may be less accurate.
		</MediumBodyText>
	) : null;

	const computedText = tide.measured.isComputed ? (
		<MediumBodyText>
			Due to station availability issues, the current water level measurement is mathematically computed and may be less accurate.
		</MediumBodyText>
	) : null;

	return (
		<>
			{/* <IconTitle iconRender={<TideLevelIcon tide={measured} />}>{title}</IconTitle> */}
			{/* <IconTitle iconRender={}></IconTitle> */}
			<TideLevelIcon tide={measured} />
			{title}
			<Block.Bat08 />
			<LeadText>
				Expect a {next.isLow ? 'low' : 'high'} of <TideHeightTextUnit height={next.height} precision={1} /> at {getTimeTwelveHourString(next.time)}.
			</LeadText>
			<Block.Bat08 />
			<MediumBodyText>
				The water level is currently <TideHeightTextUnit height={measured.height} precision={1} /> above the average low.
				The beach is most available at a water level below <TideHeightTextUnit height={iso.constant.beachAccessFullyFall} precision={0} />.
			</MediumBodyText>
			{noteRender}
			<Block.Bat08 />
			<MediumBodyText>
				Tide charts can be printed from <OutLink title='US Harbors' href="https://www.usharbors.com/harbor/maine/wells-harbor-me/tides/">US Harbors</OutLink>.
			</MediumBodyText>
			{portlandText}
			{computedText}
		</>
	);
};

const LeadText = styled.div`
	${fontStyles.lead.medium};
`;

