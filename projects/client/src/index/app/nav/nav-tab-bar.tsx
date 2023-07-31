import * as React from 'react';
import styled, { css } from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { navTabBarSize } from './nav-shared';

export interface NavTabBarProps extends Omit<NavTabBarBaseProps, 'isLower'> { }

export const NavTabBarUpper: React.FC<NavTabBarProps> = (props) => <NavTabBarBase {...props} isLower={false} />;

export const NavTabBarLower: React.FC<NavTabBarProps> = (props) => <NavTabBarBase {...props} isLower={true} />;

interface NavTabBarBaseProps {
	isLower: boolean;
	children: React.ReactNode;
}

const NavTabBarBase: React.FC<NavTabBarBaseProps> = (props) => {
	const { children, isLower } = props;

	const Bar = isLower ? NavTabBarBase_UpperBar : NavTabBarBase_LowerBar;

	return (
		<NavTabBarBase_Container isLower={isLower}>
			<Bar />
			<NavTabBarBase_TabsList>
				{children}
			</NavTabBarBase_TabsList>
		</NavTabBarBase_Container>
	);
};

const NavTabBarBase_Container = styled.div<{ isLower: boolean; }>`
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	background-color: ${themeTokens.background.dark};
`;

const NavTabBarBase_TabsList = styled.div`
	display: flex;
	flex-direction: row;
`;

const barStyle = css`
	height: ${navTabBarSize};
	width: 100%;
	position: absolute;
`;

const NavTabBarBase_UpperBar = styled.div`
	${barStyle}
	top: 0;
`;

const NavTabBarBase_LowerBar = styled.div`
	${barStyle}
	bottom: 0;
`;
