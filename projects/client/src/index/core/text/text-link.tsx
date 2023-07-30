import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { Icon } from '../icon/icon';
import { themeTokens } from '../theme/theme-root';

/*
	Links are for legit anchor tags.
	If you want a button that looks like a link, 
	try a button instead.

	Inline Link - underline
	External Link - underline, out arrow
*/


const BasicLink = styled.a`
	margin: 0;
	cursor: pointer;

	color: ${themeTokens.text.link};
	text-decoration: underline;
	&:visited, &:active, &:link, &:hover {
		color: ${themeTokens.text.link};
		text-decoration: underline;
	}

	svg {
		fill: currentColor;
		vertical-align: inherit;
	}
`;

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
	href: string;
	title: string;
}

/**
 * A link specifically used for navigation away from the application
 * in a new tab or window.
 */
export const OutLink: React.FC<LinkProps> = (props) => {
	const { children, href, rel, target, title, ...otherProps } = props;
	if (!href) {
		return null;
	}
	const text = (props.children as string) || href;
	const combinedTitle = `${title} (Opens in new tab)`;
	return (
		<BasicLink href={href} rel="noreferrer noopener" target="_blank" title={combinedTitle} {...otherProps}>
			{text}
			<OutLinkIcon type={icons.arrowOut} />
		</BasicLink>
	);
};

const OutLinkIcon = styled(Icon)`
	/** Use em to match to font */
	width: .8em;
	margin-left: .125rem;
`;

export const WrapperLink = styled.a`
	margin: 0;
	padding: 0;
	cursor: pointer;

	text-decoration: none;
	color: unset;
	&:visited, &:active, &:link, &:hover {
		text-decoration: none;
		color: unset;
	}
`;