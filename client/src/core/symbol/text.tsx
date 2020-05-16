import { styled, css } from '@/core/style/styled';
import { Theme } from '@/core/style/theme';
import { StyledComponent } from 'styled-components';

const commonTextStyle = css`
	vertical-align: top;

	/* EM value May be font-specific! */
	svg {
		margin-top: .1em;
	}
`;

// Default 1rem = 16px
export const titleHeight = '2rem';
/** Title. 2rem / 32px. */
export const Title = styled.div`
	${commonTextStyle}
	font-size: ${titleHeight};
`;
export const TitleInline = createInlineVersion(Title);

export const subtitleHeight = '1.5rem';
/** Subtitle. 1.5rem / 24px. */
export const Subtitle = styled.div`
	${commonTextStyle}
	font-size: ${subtitleHeight};
`;
export const SubtitleInline = createInlineVersion(Subtitle);

export const textHeight = '1rem';
/** Regular text. 1rem / 16px. */
export const Text = styled.div`
	${commonTextStyle}
	font-size: ${textHeight};
`;
export const TextInline = createInlineVersion(Text);
export const TextPara = styled(Text)`
	${commonTextStyle}
	margin-bottom: 1rem;
`;

export const smallTextHeight = '.875rem';
/** Small text. .875rem / 14px. */
export const SmallText = styled.div`
	${commonTextStyle}
	font-size: ${smallTextHeight};
`;
export const SmallTextInline = createInlineVersion(SmallText);

export const subTextHeight = '.75rem';
/** Small text. .75rem / 12px. */
export const SubText = styled.div`
	${commonTextStyle}
	font-size: ${subTextHeight};
`;
export const SubTextInline = createInlineVersion(SubText);

function createInlineVersion(component: StyledComponent<any, Theme, {}, never>) {
	return styled(component)`
		display: inline-block;
	`;
}