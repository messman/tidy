import * as React from "react";
import { styled, StyledFC } from "@/styles/styled";

export enum FooterToggleState {
	hidden,
	visible,
	on
}

export interface FooterToggleProps {
	svg: JSX.Element;
	title: string;
	state: FooterToggleState;
	onToggle: (isToggled: boolean) => void;
}

interface ToggleProps {
	isOn: boolean;
}

const Toggle = styled.button<ToggleProps> `
	background: ${props => props.isOn ? props => props.theme.color.background : props => props.theme.color.background};
	color: ${props => props.isOn ? props => props.theme.color.background : props => props.theme.color.background};

	border: 1px solid ${props => props.theme.color.background};
	border-radius: .5rem;
	padding: .2rem 1rem;
	margin: 1rem;
`;

export const FooterToggle: StyledFC<FooterToggleProps> = (props) => {
	if (props.state === FooterToggleState.hidden) {
		return <div></div>;
	}
	function onClick() {
		props.onToggle(props.state === FooterToggleState.on ? false : true);
	}
	return (<Toggle className={props.className} onClick={onClick} title={props.title} isOn={props.state === FooterToggleState.on}>
		{props.svg}
	</Toggle>);
};
