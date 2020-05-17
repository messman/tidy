import * as React from 'react';
import { Flex, FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { Subtitle, Text, SmallText } from '@/core/symbol/text';
import { useCurrentTheme } from '@/core/style/theme';
import { flowPaddingValue, borderRadiusStyle, edgePaddingValue } from '@/core/style/common';
import { Overlay } from '@/core/layout/overlay';

export enum PopupType {
	warning,
	error
}

export interface PopupData {
	type: PopupType,
	title: string,
	text: string,
	forcePageReload: boolean,
	forceDataRefresh: boolean,
}


export const Popup: React.FC = (props) => {

	const [popupData, setPopupData] = usePopup();
	const theme = useCurrentTheme();

	let popupBody: JSX.Element | null = null;

	if (!!popupData) {
		const { type, title, text, forcePageReload, forceDataRefresh } = popupData;

		const alertColor = type === PopupType.error ? theme.color.error : theme.color.warning;

		const buttonText = `Click/tap to  ${(forcePageReload ? 'reload page' : (forceDataRefresh ? 'refresh' : 'dismiss'))}.`;
		function onClick() {
			setPopupData(null);
			if (forcePageReload) {
				window.location.reload();
			}
			else if (forceDataRefresh) {
				// TODO - reload the data here.
			}
		}

		popupBody = (
			<FlexColumn alignItems='center' justifyContent='space-evenly'>
				<PopupBody flex={0} onClick={onClick}>
					<Icon type={iconTypes.alert} fill={alertColor} height='3rem' />
					<CenterPadding>
						<Subtitle>{title}</Subtitle>
					</CenterPadding>
					<CenterPadding>
						<Text>{text}</Text>
					</CenterPadding>
					<SmallText>{buttonText}</SmallText>
				</PopupBody>
				<Flex flex={0} />
			</FlexColumn>
		);
	}

	return (
		<Overlay isActive={!!popupData} backdropOpacity={.4} component={popupBody}>
			{props.children}
		</Overlay>
	);
}

const CenterPadding = styled.div`
	margin: ${flowPaddingValue};
`;

const PopupBody = styled(Flex)`
	background-color: ${p => p.theme.color.backgroundLighter};
	${borderRadiusStyle};
	padding: ${edgePaddingValue};
	min-width: 16rem;
	max-width: 24rem;
	text-align: center;
	margin: ${edgePaddingValue};
	cursor: pointer;
`;

export type UsePopupReturnType = [PopupData | null, React.Dispatch<React.SetStateAction<PopupData | null>>];

const PopupContext = React.createContext<UsePopupReturnType>(null!);
export const usePopup = () => React.useContext(PopupContext);

export const PopupProvider: React.FC = (props) => {

	const popupState = React.useState<PopupData | null>(null);

	return (
		<PopupContext.Provider value={popupState}>
			{props.children}
		</PopupContext.Provider>
	)
}