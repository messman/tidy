import * as React from 'react';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { smallTextHeight, SmallTextInline, subTextHeight, SubTextInline, subtitleHeight, SubtitleInline, textHeight, TextInline, titleHeight, TitleInline } from '@/core/symbol/text';
import { CosmosFixture } from '@/test';
import { flowPaddingValue } from '../style/common';
import { styled } from '../style/styled';

export default CosmosFixture.create(() => {
	const iconType = iconTypes.calendar;

	return (
		<>
			<Padding>
				<TitleInline>
					<Icon type={iconType} height={titleHeight} />
					Title
				</TitleInline>
			</Padding>
			<Padding>
				<SubtitleInline>
					<Icon type={iconType} height={subtitleHeight} />
					Subtitle
				</SubtitleInline>
			</Padding>
			<Padding>
				<TextInline>
					<Icon type={iconType} height={textHeight} />
					Text
				</TextInline>
			</Padding>
			<Padding>
				<SmallTextInline>
					<Icon type={iconType} height={smallTextHeight} />
					SmallText
				</SmallTextInline>
			</Padding>
			<Padding>
				<SubTextInline>
					<Icon type={iconType} height={subTextHeight} />
					SubText
				</SubTextInline>
			</Padding>
		</>
	);
}, {
	hasMargin: true
});

const Padding = styled.div`
	margin: ${flowPaddingValue};
`;