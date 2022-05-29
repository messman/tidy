// Handles links.
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { AnyStyledComponent } from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { routes, ViewRoute } from '../services/routing/routing';
import { SizedIcon } from './icon/icon';
import { css, styled, StyledFC } from './theme/styled';

/*
	Links are for legit anchor tags.
	If you want a button that looks like a link, 
	try a button instead.

	Inline Link - underline
	External Link - underline, out arrow
*/

const basicLinkStyles = css`
	margin: 0;
	cursor: pointer;

	color: ${p => p.theme.brand.a.main};
	text-decoration: underline;
	&:visited, &:active, &:link, &:hover {
		color: ${p => p.theme.brand.a.main};
		text-decoration: underline;
	}

	svg {
		fill: currentColor;
		vertical-align: inherit;
	}
`;

const BasicLink = styled.a`
	${basicLinkStyles};
`;

const BaseWrapperLink = styled.a`
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

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
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
	const combinedTitle = `(Opens in new tab) ${title}`;
	return (
		<BasicLink href={href} rel="noreferrer noopener" target="_blank" title={combinedTitle} {...otherProps}>
			{text}
			<SizedIcon type={icons.arrowOut} size='small' />
		</BasicLink>
	);
};

function createLinkComponent(BasedOff: AnyStyledComponent): StyledFC<LinkProps> {
	return (props) => {
		const history = useHistory();
		const { children, href, ...otherProps } = props;

		function onLinkClicked(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): boolean {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
				// Allow browser to handle the link (full navigation).
				return true;
			}
			// Use client-side routing.
			history.push(href || routes._rootHome.path);
			// Prevent the browser from handling the link.
			e.stopPropagation();
			e.preventDefault();
			return false;
		}

		return (
			<BasedOff href={href} {...otherProps} onClick={onLinkClicked} >
				{children}
			</BasedOff>
		);
	};
}

/**
 * A link for internal navigation. Uses client-side routing by default.
 * Uses an anchor tag, so user can right-click to access link options.
 * If alt/ctrl/meta/shift key is pressed, the browser handles the link
 * (for new window, new tab, etc).
 * Invisibly wraps child components.
 */
export const WrapperLink = createLinkComponent(BaseWrapperLink);

/**
 * A link for internal navigation. Uses client-side routing by default.
 * Uses an anchor tag, so user can right-click to access link options.
 * If alt/ctrl/meta/shift key is pressed, the browser handles the link
 * (for new window, new tab, etc).
 * Looks like a link (sets color and underline).
 */
export const RouterLink = createLinkComponent(BasicLink);

export interface RouterRouteLinkProps {
	route: ViewRoute;
	/** Override of title. */
	title?: string;
}

export const RouterRouteLink: StyledFC<RouterRouteLinkProps> = (props) => {
	const { route, children, title, className } = props;
	const realTitle = title || route.name;
	const childrenRender = children || route.name;

	return (
		<RouterLink className={className} href={route.path} title={realTitle}>
			{childrenRender}
		</RouterLink>
	);
};