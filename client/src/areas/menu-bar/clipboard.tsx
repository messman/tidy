import * as React from 'react';
import { iconTypes } from '@/core/symbol/icon';
import { MenuBarIcon } from './menu-bar-icon';
import { useAppDataContext } from '@/services/data/appData';


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
	isDisabled: boolean
}

export const ClipboardIcon: React.FC<ClipboardIconProps> = (props) => {

	const clipboardIconType = false ? iconTypes.clipboardCheck : iconTypes.clipboard;
	const clipboardTitle = false ? 'Copied' : 'Copy';

	function onClick(): void {

		// MDN: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
		// Permissions API might need to be used, particularly for Firefox.

		navigator.clipboard.writeText(props.text).then(function () {
			// clipboard successfully set
		}, function () {
			// clipboard write failed
		});

	}

	return (
		<MenuBarIcon
			type={clipboardIconType}
			title={clipboardTitle}
			isDisabled={props.isDisabled}
			onClick={onClick}
		/>
	);
};