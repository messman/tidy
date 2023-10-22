import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { Icon } from '../icon/icon';
import { FontWeight } from '../primitive/primitive-design';
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
	font-weight: ${FontWeight.semibold};

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

export interface LinkProps {
	href: string;
	title?: string;
	children: string;
}

/**
 * A link specifically used for navigation away from the application
 * in a new tab or window.
 */
export const OutLink: React.FC<LinkProps> = (props) => {
	const { children, href, title } = props;
	if (!href) {
		return null;
	}
	const text = children;
	const combinedTitle = `${title || text} (Opens in new tab)`;

	// Split on the last space, and ensure the icon is connected to that last word with a special span.
	const words = text.split(' ');
	const lastWord = words.at(-1);
	const otherWords = words.length > 1 ? words.slice(0, words.length - 1).join(' ') : '';
	return (
		<BasicLink href={href} rel="noreferrer noopener" target="_blank" title={combinedTitle}>
			{otherWords} <NonBreakingText>{lastWord}<OutLinkIcon type={icons.toolLinkOut} /></NonBreakingText>
		</BasicLink>
	);
};

const OutLinkIcon = styled(Icon)`
	/** Use em to match to font */
	width: .8em;
	margin-left: .125rem;
`;

const NonBreakingText = styled.span`
	white-space: nowrap;
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