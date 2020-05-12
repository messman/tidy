import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { ClipboardIcon, AllResponseClipboardIcon } from './clipboard';
import { text } from '@storybook/addon-knobs'

export default { title: 'areas/menu-bar' };

export const Clipboard = decorate(() => {

	const clipboardText = text('Clipboard Text', 'Copy me!');

	return (
		<ClipboardIcon text={clipboardText} isDisabled={false} />
	);
});

export const AllResponseClipboard = decorate(() => {

	return (
		<AllResponseClipboardIcon />
	);
});