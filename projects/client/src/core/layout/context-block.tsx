import * as React from 'react';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/theme/styled';
import { FlexColumn, FlexRow } from '@messman/react-common';

export interface ContextBlockProps {
	/** Primary component to show in the context block. */
	primary: JSX.Element,
	/** Secondary component to show on click. */
	secondary: JSX.Element;
	/** If true, top-level component will include padding. This is a convenience setting to avoid an unnecessary padding component inside. */
	paddingStyle?: string;
	/** If true, both components will be shown together in a vertical stack. */
	isDualMode: boolean;
}

export const ContextBlock: React.FC<ContextBlockProps> = (props) => {
	if (props.isDualMode) {
		return <DualModeContextBlock {...props} />;
	}
	return <SingleModeContextBlock {...props} />;
};

const DualModeContextBlock: React.FC<ContextBlockProps> = (props) => {
	const { primary, secondary, paddingStyle } = props;

	return (
		<ContextBlockRoot justifyContent='space-between'>
			<DualModeContextPanel paddingStyle={paddingStyle}>
				{primary}
			</DualModeContextPanel>
			<DualModeContextPanel paddingStyle={paddingStyle}>
				{secondary}
			</DualModeContextPanel>
		</ContextBlockRoot>
	);
};

const SingleModeContextBlock: React.FC<ContextBlockProps> = (props) => {
	const { primary, secondary, paddingStyle } = props;
	const [isShowingPrimary, setIsShowingPrimary] = React.useState(true);

	function onClick(): void {
		setIsShowingPrimary((previous) => {
			return !previous;
		});
	}

	return (
		<ContextBlockRoot onClick={onClick} justifyContent='space-between'>
			<ContextIndicator />
			<SingleModeContainer isShowingPrimary={isShowingPrimary} alignItems='stretch'>
				<SingleModeContextPanel paddingStyle={paddingStyle}>
					{primary}
				</SingleModeContextPanel>
				<SingleModeContextPanel paddingStyle={paddingStyle}>
					{secondary}
				</SingleModeContextPanel>
			</SingleModeContainer>
		</ContextBlockRoot>
	);
};

interface DualModeContextPanelProps {
	paddingStyle?: string;
}

const DualModeContextPanel = styled.div<DualModeContextPanelProps>`
	padding: ${p => p.paddingStyle || edgePaddingValue};
	overflow: hidden;
`;

interface SingleModeContainerProps {
	isShowingPrimary: boolean;
}

const SingleModeContainer = styled(FlexRow) <SingleModeContainerProps>`
	width: 200%;
	left: ${p => p.isShowingPrimary ? '0' : '-100%'};
	cursor: pointer;
`;


const ContextBlockRoot = styled(FlexColumn)`
	background-color: ${p => p.theme.color.backgroundLighter};
	${borderRadiusStyle};
	
	overflow: hidden;
`;

interface SingleModeContextPanelProps {
	paddingStyle?: string;
}

const SingleModeContextPanel = styled.div <SingleModeContextPanelProps>`
	padding: ${p => p.paddingStyle || edgePaddingValue};
	overflow: hidden;
	flex: 1;
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