import * as React from "react";
import styled from "@/styles/theme";

export enum SVGToggleState {
	hidden,
	visible,
	on
}

export interface SVGToggleProps {
	svg: JSX.Element;
	title: string;
	state: SVGToggleState;
	onToggle: (isToggled: boolean) => void;
}

interface ToggleProps {
	isOn: boolean;
}

const Toggle = styled.button<ToggleProps> `
	background: ${props => props.isOn ? props => props.theme.color.layerLight : props => props.theme.color.bgDark};
	color: ${props => props.isOn ? props => props.theme.color.bgDark : props => props.theme.color.layerLight};

	border: 1px solid ${props => props.theme.color.layerLight};
	border-radius: .5rem;
	padding: .2rem 1rem;
	margin: 1rem;
`;

export const SVGToggle: React.FC<SVGToggleProps> = (props) => {
	if (props.state === SVGToggleState.hidden) {
		return <div></div>;
	}
	function onClick() {
		props.onToggle(props.state === SVGToggleState.on ? false : true);
	}
	return (<Toggle onClick={onClick} title={props.title} isOn={props.state === SVGToggleState.on}>
		{props.svg}
	</Toggle>);
};
