import * as React from 'react';
import { iconTypes } from '@/core/symbol/icon';
import { MenuBarIcon } from './menu-bar-icon';
import { useAppDataContext } from '@/services/data/appData';
import { usePopup, PopupType } from '../alert/popup';


export const AllResponseClipboardIcon: React.FC = () => {

	const { isLoading, success } = useAppDataContext();

	let text = '';
	let isDisabled = true;

	if (!isLoading && success) {
		text = success.info.referenceTime.toISOString();
		isDisabled = false;
	}

	return (
		<ClipboardIcon text={text} isDisabled={isDisabled} />
	);
};

interface ClipboardIconProps {
	text: string,
	isDisabled: boolean,
	isForceFailure?: boolean
}

const clipboardTimeout = 5000;

export const ClipboardIcon: React.FC<ClipboardIconProps> = (props) => {

	const setPopupData = usePopup()[1];

	const [isSuccess, setIsSuccess] = React.useState(false);
	const [isFailure, setIsFailure] = React.useState(false);

	const isDisabled = isSuccess || isFailure || props.isDisabled;
	const clipboardIconType = isSuccess ? iconTypes.clipboardCheck : iconTypes.clipboard;
	const clipboardTitle = isSuccess ? 'Copied' : 'Copy';

	function onClick(): void {

		function waitForReset(): void {
			setTimeout(() => {
				setIsSuccess(false);
				setIsFailure(false);
			}, clipboardTimeout);
		}

		function onSuccess(): void {
			setIsSuccess(true);
			waitForReset();
		}

		function onError(): void {
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

		// MDN: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
		// Permissions API might need to be used, particularly for Firefox.
		if (!props.isForceFailure) {
			navigator.clipboard.writeText(props.text).then(onSuccess, onError);
		}
		else {
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