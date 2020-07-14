import * as React from 'react';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { CONSTANT } from '@/services/constant';
import { useElementSize } from '@/services/layout/element-size';
import { FlexColumn } from './flex';

export interface ContextBlockProps {
	/** Primary component to show in the context block. */
	primary: JSX.Element,
	/** Secondary component to show on click. */
	secondary: JSX.Element;
	/** If true, top-level component will include the theme padding. This is a convenience setting to avoid an unnecessary padding component inside. */
	isPadded: boolean;
	/** If true, both components will be shown together in a vertical stack. */
	isDualMode: boolean;
}

export const ContextBlock: React.FC<ContextBlockProps> = (props) => {

	const { primary, secondary, isPadded, isDualMode } = props;
	const [isShowingPrimary, setIsShowingPrimary] = React.useState(true);

	const ref = React.useRef<HTMLDivElement>(null!);
	const primaryPanelSize = useElementSize(ref, CONSTANT.elementSizeSmallThrottleTimeout, null);
	const primaryPanelHeight = (!isDualMode && primaryPanelSize.height > 0) ? primaryPanelSize.height : undefined;

	let contextIndicator: JSX.Element | null = null;
	if (primary && secondary && !isDualMode) {
		contextIndicator = <ContextIndicator />;
	}

	function onClick(): void {
		if (!isDualMode) {
			setIsShowingPrimary((previous) => {
				return !previous;
			});
		}
	}

	return (
		<ContextBlockRoot onClick={onClick} justifyContent='space-between'>
			{contextIndicator}
			<ContextBlockPanel ref={ref} isActive={isShowingPrimary || isDualMode} isPadded={isPadded} isDualMode={isDualMode}>
				{primary}
			</ContextBlockPanel>
			<ContextBlockDependentPanel heightInPixels={primaryPanelHeight} isActive={!isShowingPrimary || isDualMode} isPadded={isPadded} isDualMode={isDualMode}>
				{secondary}
			</ContextBlockDependentPanel>
		</ContextBlockRoot>
	);
};

const ContextBlockRoot = styled(FlexColumn)`
	background-color: ${p => p.theme.color.backgroundLighter};
	${borderRadiusStyle};
	
	overflow: hidden;
`;

interface ContextBlockPanelProps {
	isActive: boolean,
	heightInPixels?: number;
	isPadded: boolean;
	isDualMode: boolean;
}

const ContextBlockPanel = styled.div <ContextBlockPanelProps>`
	padding: ${p => p.isPadded ? edgePaddingValue : 0};
	display: ${p => p.isActive ? 'block' : 'none'};
	cursor: ${p => p.isDualMode ? 'unset' : 'pointer'};
`;

const ContextBlockDependentPanel = styled(ContextBlockPanel)`
	height: ${p => p.heightInPixels}px;
	overflow-y: auto;
`;

const contextIndicatorLength = 24;
const ContextIndicator = styled.div`
	background-color: ${p => p.theme.color.backgroundLightest};
	width: ${contextIndicatorLength}px;
	height: ${contextIndicatorLength}px;
	transform: rotateZ(45deg);
	position: absolute;
	top: -${contextIndicatorLength / 2}px;
	right: -${contextIndicatorLength / 2}px;
`;