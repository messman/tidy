import * as React from 'react';
import { FlexRow } from '@/core/layout/flex';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';


export interface ContextBlockProps {
	primary: JSX.Element,
	secondary: JSX.Element
	isPadded: boolean
}

export const ContextBlock: React.FC<ContextBlockProps> = (props) => {

	const [isShowingPrimary, setIsShowingPrimary] = React.useState(true);
	const ref = React.useRef<HTMLDivElement>(null!);
	const primaryPanelSize = useElementSize(ref, CONSTANT.elementSizeSmallThrottleTimeout);
	const primaryPanelHeight = primaryPanelSize.height > 0 ? primaryPanelSize.height : 0;

	function onClick(): void {
		setIsShowingPrimary((previous) => {
			return !previous;
		});
	}

	return (
		<ContextBlockRoot flex='none' onClick={onClick} isPadded={props.isPadded}>
			<ContextBlockPanel ref={ref} isActive={isShowingPrimary}>
				{props.primary}
			</ContextBlockPanel>
			<ContextBlockDependentPanel heightInPixels={primaryPanelHeight} isActive={!isShowingPrimary}>
				{props.secondary}
			</ContextBlockDependentPanel>
		</ContextBlockRoot>
	);
};

interface ContextBlockRootProps {
	isPadded: boolean
}

const ContextBlockRoot = styled(FlexRow) <ContextBlockRootProps>`
	background-color: ${p => p.theme.color.backgroundLighter};
	${borderRadiusStyle};
	padding: ${p => p.isPadded ? edgePaddingValue : 0};
	overflow: hidden;
	cursor: pointer;
`;

interface ContextBlockPanelProps {
	isActive: boolean,
	heightInPixels?: number
}

const ContextBlockPanel = styled(FlexRow) <ContextBlockPanelProps>`
	display: ${p => p.isActive ? 'flex' : 'none'};
`;

const ContextBlockDependentPanel = styled(ContextBlockPanel)`
	height: ${p => p.heightInPixels}px;
`;