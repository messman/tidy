import * as React from 'react';
import { iconTypes } from '@/core/symbol/icon';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { getTimeTwelveHourString } from '@/services/time';
import { setClipboard } from '@messman/react-common';
import { PopupType, usePopup } from '../alert/popup';
import { MenuBarIcon } from './menu-bar-icon';

/** Connects directly to the data store to create text to describe the data. Copied to clipboard when clicked. */
export const AllResponseClipboardIcon: React.FC = () => {
	const allResponseState = useAllResponse();

	let isDisabled = false;
	let text: string[] = [];

	if (hasAllResponseData(allResponseState)) {
		isDisabled = false;
		const { all, info } = allResponseState.data!;
		const { tides } = all.current;
		const next = tides.range.events[1];

		const referenceTimeString = getTimeTwelveHourString(info.referenceTime);
		const tideActionText = next.isLow ? 'falling' : 'rising';
		const nextTideText = next.isLow ? 'Low' : 'High';
		const nextTideTimeString = getTimeTwelveHourString(next.time);

		/*
			TODO - figure out what else we want to put in.
			Will data be scoped by the day, or by the next X hours?
			Should we even include the reference time (knowing it could be 0-10 minutes off due to caching?)
		*/

		// const allDayTides = all.daily.days[0].tides;
		// const dayTidesText = allDayTides.events.map((tideEvent) => {
		// 	const tideText = tideEvent.isLow ? 'low' : 'high';
		// 	const tideTimeString = getTimeTwelveHourString(tideEvent.time);
		// 	return `${tideText}, ${tideTimeString}`;
		// }).join('; ');

		// const sunEventText = sun.next.isSunrise ? 'Sunrise' : 'Sunset';
		// const sunEventTimeString = getTimeTwelveHourString(sun.next.time);

		text = [
			`It's ${referenceTimeString}. The tide is ${tideActionText}.`,
			`${nextTideText} tide is at ${nextTideTimeString}.`,
			``,
			`https://tidy.andrewmessier.com`,
		];
	}

	return (
		<ClipboardIcon text={text} isDisabled={isDisabled} />
	);
};

interface ClipboardIconProps {
	/** Text that will be copied to clipboard. */
	text: string | string[],
	/** Whether or not the clipboard icon is disabled. */
	isDisabled: boolean,
	/** Used for testing. */
	isForceFailure?: boolean;
}

// Used to disable the clipboard to prevent spam clicking.
const clipboardTimeout = 5000;

export const ClipboardIcon: React.FC<ClipboardIconProps> = (props) => {

	const setPopupData = usePopup()[1];

	// Use two booleans to track the 3 states - success, failure, not clicked
	const [isSuccess, setIsSuccess] = React.useState(false);
	const [isFailure, setIsFailure] = React.useState(false);
	const isMounted = React.useRef(true);

	React.useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const isDisabled = isSuccess || isFailure || props.isDisabled;
	const clipboardIconType = isSuccess ? iconTypes.clipboardCheck : iconTypes.clipboard;
	const clipboardTitle = isSuccess ? 'Copied' : 'Copy';

	async function onClick(): Promise<void> {
		if (!props.text) {
			return;
		}

		function waitForReset(): void {
			setTimeout(() => {
				if (!isMounted.current) {
					return;
				}
				setIsSuccess(false);
				setIsFailure(false);
			}, clipboardTimeout);
		}

		function onSuccess(): void {
			if (!isMounted.current) {
				return;
			}
			setIsSuccess(true);
			waitForReset();
		}

		function onError(): void {
			if (!isMounted.current) {
				return;
			}
			setIsFailure(true);
			setPopupData({
				type: PopupType.warning,
				title: 'Failed to copy',
				text: 'The application could not copy text to your clipboard.',
				forceDataRefresh: false,
				forcePageReload: false
			});
			waitForReset();
		}

		try {
			if (props.isForceFailure) {
				throw new Error('Purposefully failing.');
			}
			await setClipboard(props.text);
			onSuccess();
		}
		catch (error) {
			onError();
		}
	}

	return (
		<MenuBarIcon
			type={clipboardIconType}
			title={clipboardTitle}
			isDisabled={isDisabled}
			onClick={onClick}
		/>
	);
};