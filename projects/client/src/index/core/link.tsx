// import * as React from 'react';
// import styled, { css } from 'styled-components';

// /*
// 	Links are for legit anchor tags.
// 	If you want a button that looks like a link, 
// 	try a button instead.

// 	Inline Link - underline
// 	External Link - underline, out arrow
// */

// const basicLinkStyles = css`
// 	margin: 0;
// 	cursor: pointer;

// 	color: ${themeTokens.textLink};
// 	text-decoration: underline;
// 	&:visited, &:active, &:link, &:hover {
// 		color: ${themeTokens.textLink};
// 		text-decoration: underline;
// 	}

// 	svg {
// 		fill: currentColor;
// 		vertical-align: inherit;
// 	}
// `;

// const BasicLink = styled.a`
// 	${basicLinkStyles};
// `;

// export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
// 	href: string;
// 	title: string;
// }

// /**
//  * A link specifically used for navigation away from the application
//  * in a new tab or window.
//  */
// export const OutLink: React.FC<LinkProps> = (props) => {
// 	const { children, href, rel, target, title, ...otherProps } = props;
// 	if (!href) {
// 		return null;
// 	}
// 	const text = (props.children as string) || href;
// 	const combinedTitle = `${title} (Opens in new tab)`;
// 	return (
// 		<BasicLink href={href} rel="noreferrer noopener" target="_blank" title={combinedTitle} {...otherProps}>
// 			{text}
// 			{/* <SizedIcon type={icons.arrowOut} size='small' /> */}
// 		</BasicLink>
// 	);
// };