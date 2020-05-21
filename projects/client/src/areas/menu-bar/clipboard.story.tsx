import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { boolean, text } from '@storybook/addon-knobs';
import { AllResponseClipboardIcon, ClipboardIcon } from './clipboard';

export default { title: 'areas/menu-bar' };

export const Clipboard = decorate(() => {

	const clipboardText = text('Clipboard Text', 'Copy me!');
	const isForceFailure = boolean('Force Failure', false);

	return (
		<div>
			<ClipboardIcon text={clipboardText} isDisabled={false} isForceFailure={isForceFailure} />
		</div>
	);
});

export const AllResponseClipboard = decorate(() => {

	return (
		<div>
			<AllResponseClipboardIcon />
		</div>
	);
});