import * as React from 'react';
import { FlexRoot } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';

export interface OverlayProps {
	isActive: boolean,
	component: JSX.Element | null,
	backdropOpacity?: number,
	backdropColor?: string
}

export const Overlay: React.FC<OverlayProps> = (props) => {

	const theme = useCurrentTheme();
	const { isActive, component, backdropOpacity, backdropColor } = props;

	const backdropProps: OverlayAbsoluteBackdropProps = {
		isActive: isActive,
		backgroundColor: backdropColor || theme.color.background,
		backdropOpacity: backdropOpacity || 1
	};

	return (
		<>
			{props.children}
			<OverlayAbsoluteBackdrop {...backdropProps} />
			<OverlayAbsoluteComponentContainer isActive={isActive}>
				{component}
			</OverlayAbsoluteComponentContainer>
		</>
	);
}

interface OverlayAbsoluteBackdropProps {
	isActive: boolean,
	backgroundColor: string,
	backdropOpacity: number,
}

const OverlayAbsoluteBackdrop = styled.div<OverlayAbsoluteBackdropProps>`
	display: ${p => p.isActive ? 'block' : 'none'};
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: ${p => p.backgroundColor};
	opacity: ${p => p.backdropOpacity};
`;

interface OverlayAbsoluteComponentContainerProps {
	isActive: boolean
}

const OverlayAbsoluteComponentContainer = styled(FlexRoot) <OverlayAbsoluteComponentContainerProps>`
	display: ${p => p.isActive ? 'flex' : 'none'};
	position: absolute;
	top: 0;
	left: 0;
`;