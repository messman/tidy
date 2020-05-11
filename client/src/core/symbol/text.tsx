import { styled, css } from '@/core/style/styled';
import { Theme } from '@/core/style/theme';
import { StyledComponent } from 'styled-components';

const commonTextStyle = css`
	vertical-align: top;
`;

// Default 1rem = 16px

/** Title. 2rem / 32px. */
export const Title = styled.div`
	${commonTextStyle}
	font-size: 2rem;
`;
export const TitleInline = createInlineVersion(Title);

/** Subtitle. 1.5rem / 24px. */
export const Subtitle = styled.div`
	${commonTextStyle}
	font-size: 1.5rem;
`;
export const SubtitleInline = createInlineVersion(Subtitle);

/** Regular text. 1rem / 16px. */
export const Text = styled.div`
	${commonTextStyle}
	font-size: 1rem;
`;
export const TextInline = createInlineVersion(Text);
export const TextPara = styled(Text)`
	${commonTextStyle}
	margin-bottom: 1rem;
`;

/** Small text. .875rem / 14px. */
export const SmallText = styled.div`
	${commonTextStyle}
	font-size: .875rem;
`;
export const SmallTextInline = createInlineVersion(SmallText);

/** Small text. .75rem / 12px. */
export const SubText = styled.div`
	${commonTextStyle}
	font-size: .75rem;
`;
export const SubTextInline = createInlineVersion(SubText);

function createInlineVersion(component: StyledComponent<any, Theme, {}, never>) {
	return styled(component)`
		display: inline-block;
	`;
}