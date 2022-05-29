import * as React from 'react';
import { EmptyIconName, SVGIconType, SVGIconTypeName } from '@wbtdevlocal/assets';
import { ComponentSize } from '../theme/font';
import { styled, StyledFC } from '../theme/styled';
import { UrlIcon } from './icon-url';

export type IconInputType = JSX.Element | SVGIconType | StyledFC | SVGIconTypeName | EmptyIconName | null;

export interface IconProps {
	/**
	 * If an SVG name is given, the SVG is loaded from URL.
	 */
	type: IconInputType;
}

/**
 * An SVG icon. See internals for details.
 */
export const Icon: StyledFC<IconProps> = (props) => {
	/*
		Icon build process is explained in @wbtdevlocal/assets.
		Remember: icons are colored through the 'color' property if properly exported from Sketch.
	*/
	const { className, type } = props;
	if (typeof (type) === 'number') {
		return <UrlIcon value={type} className={className} />;
	}
	if (!type) {
		return null;
	}
	if (React.isValidElement(type)) {
		return type;
	}
	const IconComponent = (type === 'empty' ? EmptyIcon : type) as StyledFC;
	return (
		<IconComponent className={className} />
	);
};

export interface SizedIconProps extends IconProps {
	size: ComponentSize;
}

/*
	Possibly out-of-date note:
	Apparently at some point in 2019/2020 there was an issue
	where Safari could not take 'rem' units for svg.
	In that case, you'd need to use a span wrapper element and 100% 
	width or height on the SVG.
*/
export const SizedIcon = styled(Icon) <SizedIconProps>`
	width: ${p => iconHeights[p.size]};
	height: ${p => iconHeights[p.size]};
`;

export const iconHeights: Record<ComponentSize, string> = {
	medium: '1.5rem',
	small: '1.25rem',
	tiny: '1rem',
};

export const EmptyIcon = styled.span`
	display: inline-block;
	position: relative;
`;

/*
	Special Icons: Chevron Left Inline (arrowChevronLeftInline) and Chevron Right Inline (arrowChevronRightInline)
	In Figma, icons are designed with internal padding and to be square (same width/height).
	These inline icons are instead made to be form-fitting with no padding and not square so they align better with text.
	This means they need custom width and height declarations.
	These width and height dimensions come from Figma.
*/
export const SizedIconArrowChevronInline = styled(Icon) <SizedIconProps>`
	width: calc(${p => iconHeights[p.size]} / 3);
	height: ${p => iconHeights[p.size]};
`;