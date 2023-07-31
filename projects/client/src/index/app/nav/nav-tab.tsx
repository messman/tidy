import * as React from 'react';
import styled, { css } from 'styled-components';
import { ClickWrapperButton } from '@/index/core/form/button';
import { Icon, IconInputType } from '@/index/core/icon/icon';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { navTabBarSize } from './nav-shared';

export interface NavTabProps extends Omit<NavTabBaseProps, 'isLower'> { }

export const NavTabUpper: React.FC<NavTabProps> = (props) => <NavTabBase {...props} isLower={false} />;

export const NavTabLower: React.FC<NavTabProps> = (props) => <NavTabBase {...props} isLower={true} />;

interface NavTabBaseProps {
	isActive: boolean;
	icon: IconInputType;
	children: string;
	onClick: () => void;
	isLower: boolean;
}

const NavTabBase: React.FC<NavTabBaseProps> = (props) => {
	const { isActive, icon, children, onClick, isLower } = props;

	const Bar = isLower ? NavTabBase_UpperBar : NavTabBase_LowerBar;
	const barRender = isActive ? <Bar /> : null;

	return (
		<ClickWrapperButton onClick={onClick}>
			<NavTabBase_Container isLower={isLower} title={children}>
				{barRender}
				<NavTabBase_Icon type={icon} isActive={isActive} />
				<NavTabBase_Title isActive={isActive}>
					{children}
				</NavTabBase_Title>
			</NavTabBase_Container>
		</ClickWrapperButton>
	);
};

const NavTabBase_Container = styled.div<{ isLower: boolean; }>`
	position: relative;
	width: 4rem;
	overflow: hidden;

	padding: ${p => p.isLower ? ".5rem 0 .25rem 0" : ".25rem 0 .5rem 0"};
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const NavTabBase_Icon = styled(Icon) <{ isActive: boolean; }>`
	width: 1.5rem;
	height: 1.5rem;
	color: ${p => p.isActive ? themeTokens.text.distinct : themeTokens.text.subtle};
`;

const NavTabBase_Title = styled.div<{ isActive: boolean; }>`
	${fontStyles.text.smallHeavy}
	color: ${p => p.isActive ? themeTokens.text.distinct : themeTokens.text.subtle};
`;

const barStyle = css`
	left: 0;
	height: ${navTabBarSize};
	width: 100%;
	position: absolute;
	background-color: ${themeTokens.text.distinct};
`;

const NavTabBase_UpperBar = styled.div`
	${barStyle}
	top: 0;
`;

const NavTabBase_LowerBar = styled.div`
	${barStyle}
	bottom: 0;
`;
