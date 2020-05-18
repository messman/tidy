import * as React from 'react';
import { FlexRow } from '@/core/layout/flex';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';


export interface ContextBlockProps {
	Primary: React.FC,
	Secondary: React.FC
}

export const ContextBlock: React.FC<ContextBlockProps> = (props) => {
	const { Primary, Secondary } = props;

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
		<ContextBlockRoot flex='none' onClick={onClick}>
			<ContextBlockPanel ref={ref} isActive={isShowingPrimary}>
				<Primary />
			</ContextBlockPanel>
			<ContextBlockDependentPanel heightInPixels={primaryPanelHeight} isActive={!isShowingPrimary}>
				<Secondary />
			</ContextBlockDependentPanel>
		</ContextBlockRoot>
	);
};

const ContextBlockRoot = styled(FlexRow)`
	background-color: ${p => p.theme.color.backgroundLighter};
	${borderRadiusStyle};
	padding: ${edgePaddingValue};
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