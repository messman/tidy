import * as React from 'react';
import styled, { css } from 'styled-components';
import { emptyIcon, EmptyIconName, SVGIcon, SVGIconUrlNameLookup } from '@wbtdevlocal/assets';
import { ComponentSize } from '../primitive/primitive-design';
import { StyledFC } from '../primitive/primitive-styled';
import { UrlIcon, useSVGIconUrlCache } from './icon-url';

export type IconInputType = JSX.Element | SVGIcon | StyledFC | string | EmptyIconName | null;

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
		Remember: icons are colored through the 'color' property if properly exported.
	*/
	const { className, type } = props;

	// This does NOT cause re-renders when the cache changes. Safe to have in every icon.
	const cache = useSVGIconUrlCache();

	if (type === emptyIcon) {
		// Empty icon
		return <EmptyIcon className={className} />;
	}
	if (!type) {
		return null;
	}
	if (React.isValidElement(type)) {
		// It's an inline element, and not a component
		return type;
	}
	if (typeof (type) === 'string') {
		const iconName = SVGIconUrlNameLookup[type];
		if (iconName) {
			// It's a URL for loading an SVG Icon.
			// Check the cache for the matching component.
			const entry = cache.getEntry(iconName);
			if (entry?.SVGIconComponent) {
				const IconComponent = entry.SVGIconComponent as StyledFC;
				return <IconComponent className={className} />;
			}
			return <UrlIcon iconName={iconName} className={className} />;
		}
		return null;
	}
	// It's a component, like SVGIcon
	const IconComponent = type as StyledFC;
	if (isSVGIcon(type)) {
		cache.addSVGIconComponent(type);
	}
	return (
		<IconComponent className={className} />
	);
};

function isSVGIcon(icon: any): icon is SVGIcon {
	return !!icon && !!(icon as SVGIcon).iconName;
}

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

/**
 * Fix for Safari rendering issue. Some icons (haven't figured out why, but the moon phase icons)
 * won't render unless an explicit width or height is set on them.
 * Only Safari. Only some icons. But it seems to not hurt the others.
*/
export const defaultIconSvgStyle = css`
	svg {
		width: 100%;
		height: 100%;
	}
`;

export const iconHeights: Record<ComponentSize, string> = {
	medium: '1.5rem',
	small: '1.25rem',
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
export const inlineArrowChevronIconHeights = {
	medium: { height: '1.5rem', width: '.625rem' },
	small: { height: '1rem', width: '.5rem' }
} as const satisfies Record<ComponentSize, { width: string, height: string; }>;

export const SizedIconArrowChevronInline = styled(Icon) <SizedIconProps>`
	width: ${p => inlineArrowChevronIconHeights[p.size].width};
	height: ${p => inlineArrowChevronIconHeights[p.size].height};
`;