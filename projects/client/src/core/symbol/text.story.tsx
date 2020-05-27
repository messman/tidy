import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { TitleInline, titleHeight, SubtitleInline, subtitleHeight, TextInline, textHeight, SmallTextInline, smallTextHeight, SubTextInline, subTextHeight } from '@/core/symbol/text';
import { iconTypes, Icon } from '@/core/symbol/icon';
import { styled } from '../style/styled';
import { flowPaddingValue } from '../style/common';

export default { title: 'core/symbol' };

export const TestTextWithIcons = decorate(() => {

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
});

const Padding = styled.div`
	margin: ${flowPaddingValue};
`;