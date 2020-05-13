import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { ClipboardIcon, AllResponseClipboardIcon } from './clipboard';
import { text, boolean } from '@storybook/addon-knobs'

export default { title: 'areas/menu-bar' };

export const Clipboard = decorate(() => {

	const clipboardText = text('Clipboard Text', 'Copy me!');
	const isForceFailure = boolean('Force Failure', false);

	return (
		<ClipboardIcon text={clipboardText} isDisabled={false} isForceFailure={isForceFailure} />
	);
});

export const AllResponseClipboard = decorate(() => {

	return (
		<AllResponseClipboardIcon />
	);
});