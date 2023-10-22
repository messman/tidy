import * as React from 'react';
import styled from 'styled-components';
import { AnimationDuration } from '@/index/core/animation/animation';
import { IconInputType, SizedIcon } from '@/index/core/icon/icon';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { tab, useNav } from './nav-context';

export interface NavProps {
	isLower: boolean;
};


export const Nav: React.FC<NavProps> = (props) => {
	const { isLower } = props;

	const { selectedTab, selectTab } = useNav();

	return (
		<Container style={{ backgroundColor: isLower ? themeTokens.background.bottom : themeTokens.background.top }}>
			<NavItem
				icon={icons.coreNewSparkle}
				isSelected={selectedTab === tab.now}
				isLower={isLower}
				onClick={() => { selectTab(tab.now); }}
			>
				Now
			</NavItem>
			<NavItem
				icon={icons.coreCalendar}
				isSelected={selectedTab === tab.week}
				isLower={isLower}
				onClick={() => { selectTab(tab.week); }}
			>
				Week
			</NavItem>
			<NavItem
				icon={icons.coreEducation}
				isSelected={selectedTab === tab.learn}
				isLower={isLower}
				onClick={() => { selectTab(tab.learn); }}
			>
				Learn
			</NavItem>
			<NavItem
				icon={icons.informInfoCircle}
				isSelected={selectedTab === tab.about}
				isLower={isLower}
				onClick={() => { selectTab(tab.about); }}
			>
				About
			</NavItem>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: .5rem;
`;

interface NavItemProps {
	isLower: boolean;
	isSelected: boolean;
	icon: IconInputType;
	onClick: () => void;
	children: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = (props) => {
	const { isLower, isSelected, icon, onClick, children } = props;

	return (
		<NavItem_Container $isSelected={isSelected} onClick={onClick}>
			<SizedIcon size="medium" type={icon} />
			<NavItem_Text>{children}</NavItem_Text>
			{isSelected && <NavItem_SelectionBar $isLower={isLower} />}
		</NavItem_Container>
	);
};

const NavItem_Container = styled.button<{ $isSelected: boolean; }>`
	cursor: pointer;
	position: relative;
	border: 0;
	background-color: transparent;
	width: 4rem;
	height: 3.5rem;
	color: ${p => p.$isSelected ? themeTokens.text.distinct : themeTokens.text.subtle};
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: .25rem;
	gap: .25rem;
	transition: color ${AnimationDuration.c_quick} ease;
`;

const NavItem_SelectionBar = styled.div<{ $isLower: boolean; }>`
	width: 100%;
	height: 2px;
	background-color: ${themeTokens.text.distinct};
	position: absolute;
	${p => p.$isLower ? 'top' : 'bottom'}: 0;
	left: 0;
`;

const NavItem_Text = styled.div`
	${fontStyles.text.small};
`

