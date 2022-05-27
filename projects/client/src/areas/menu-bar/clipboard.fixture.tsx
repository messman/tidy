import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { AllResponseClipboardIcon, ClipboardIcon } from './clipboard';

export default {
	'Clipboard': CosmosFixture.create(() => {
		const clipboardText = Cosmos.useControlValue('Clipboard Text', 'Copy me!');
		const isForceFailure = Cosmos.useControlValue('Force Failure', false);

		return (
			<div>
				<ClipboardIcon text={clipboardText} isDisabled={false} isForceFailure={isForceFailure} />
			</div>
		);
	}, {
		hasMargin: true
	}),

	'All Response Clipboard': CosmosFixture.create(() => {

		return (
			<div>
				<AllResponseClipboardIcon />
			</div>
		);
	}, {
		hasMargin: true
	}),
};