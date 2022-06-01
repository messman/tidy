// import * as React from 'react';
// import { Overlay } from '@/core/layout/overlay';
// import { Icon } from '@/core/icon/icon';
// import { Paragraph } from '@/core/text';
// import { styled } from '@/core/theme/styled';
// import { CONSTANT } from '@/services/constant';
// import { useBatchLatestResponse } from '@/services/data/data';

// export enum PopupType {
// 	/** Execution can continue. */
// 	warning,
// 	/** The application is probably messed up big time. */
// 	error
// }

// export interface PopupData {
// 	/** Type of popup (warning/error). */
// 	type: PopupType,
// 	title: string,
// 	text: string,
// 	/** If true, the only option for the user is page reload. */
// 	forcePageReload: boolean,
// 	/** If true, the only option for the user is data refresh. */
// 	forceDataRefresh: boolean,
// }

// /**
//  * Popup component will render over the top of any content and show a message.
//  * The user can tap the center message to take the requested action.
//  */
// export const Popup: React.FC = (props) => {

// 	// Pull from our context.
// 	const [popupData, setPopupData] = usePopup();
// 	const { reset } = useBatchLatestResponse();

// 	let popupBody: JSX.Element | null = null;

// 	// If the application set a pop-up...
// 	if (!!popupData) {
// 		const { type, title, text, forcePageReload, forceDataRefresh } = popupData;

// 		const buttonText = `Click/tap to  ${(forcePageReload ? 'reload page' : (forceDataRefresh ? 'refresh' : 'dismiss'))}.`;
// 		function onClick() {
// 			// Clear our data.
// 			setPopupData(null);
// 			if (forcePageReload) {
// 				window.location.reload();
// 			}
// 			else if (forceDataRefresh) {
// 				// Reload the data.
// 				const keepDataAndError = CONSTANT.clearDataOnNewFetch ? null : undefined;
// 				reset({
// 					isStarted: true,
// 					data: keepDataAndError,
// 					error: keepDataAndError
// 				});
// 			}
// 		}

// 		/*
// 			Structure:
// 			- Outer FlexColumn that centers each row and spaces them apart evenly.
// 				- A main 'PopupBody' that is sized by its contents.
// 				- A Flex element with flex=0 that is essentially invisible.. but combined with space-evenly, pushes up the PopupBody to be in the upper section of the screen instead of exactly centered.
// 		*/
// 		popupBody = (
// 			<FlexColumn alignItems='center' justifyContent='space-evenly'>
// 				<PopupBody flex='none' onClick={onClick}>
// 					<Icon type={iconTypes.alert} fillColor={alertColor} height={titleHeight} />
// 					<PaddedSubtitle>{title}</PaddedSubtitle>
// 					<PaddedText>{text}</PaddedText>
// 					<SmallText>{buttonText}</SmallText>
// 				</PopupBody>
// 				<Flex flex='none' />
// 			</FlexColumn>
// 		);
// 	}

// 	return (
// 		<Overlay isActive={!!popupData} backdropOpacity={.4} component={popupBody}>
// 			{props.children}
// 		</Overlay>
// 	);
// };

// const PaddedSubtitle = addMargin(Subtitle, flowPaddingValue);
// const PaddedText = addMargin(Text, flowPaddingValue);

// const PopupBody = styled(Flex)`
// 	background-color: ${p => p.theme.color.backgroundLighter};
// 	${borderRadiusStyle};
// 	padding: ${Spacing.dog16};
// 	cursor: pointer;

// 	/* Prevents crazy resizing scenarios. */
// 	min-width: 16rem;
// 	max-width: 24rem;
// 	margin: ${Spacing.dog16};

// 	text-align: center;
// `;

// export type UsePopupReturnType = [PopupData | null, React.Dispatch<React.SetStateAction<PopupData | null>>];
// const PopupContext = React.createContext<UsePopupReturnType>(null!);

// /** Provider to hold state for Popup info. */
// export const PopupProvider: React.FC = (props) => {

// 	const popupState = React.useState<PopupData | null>(null);

// 	return (
// 		<PopupContext.Provider value={popupState}>
// 			{props.children}
// 		</PopupContext.Provider>
// 	);
// };
// export const usePopup = () => React.useContext(PopupContext);