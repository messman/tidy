import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { Block } from '@/index/core/layout/layout-shared';
import { OutLink } from '@/index/core/text/text-link';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { getTimeTwelveHourString } from '@/index/core/time/time';
import * as iso from '@wbtdevlocal/iso';
import { TideHeightTextUnit } from '../tide-common';
import { TideLevelIcon } from '../tide-level-icon';
import { getTideTitle } from '../tide-utility';

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

