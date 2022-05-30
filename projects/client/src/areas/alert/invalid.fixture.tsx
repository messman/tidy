import * as React from 'react';
import { Paragraph } from '@/core/text';
import { Cosmos, CosmosFixture } from '@/test';
import { ThemePicker } from '../settings/theme-picker';
import { InvalidCheck } from './invalid';

export default CosmosFixture.create(() => {
	// Set up knobs.
	const isForceAlertMessages = Cosmos.useControlValue('Force Alert Messages', false);
	const firstAlertMessage = Cosmos.useControlValue('First Alert Message', 'Houston, we have a problem.');
	const secondForceAlertMessage = Cosmos.useControlValue('Second Alert Message', 'but we probably do not know what that problem is.');

	// Require checkbox before we pass any strings.
	const alertMessages = [];
	if (isForceAlertMessages && firstAlertMessage) {
		alertMessages.push(firstAlertMessage);
		if (secondForceAlertMessage) {
			alertMessages.push(secondForceAlertMessage);
		}
	}

	const isForceInternetExplorer = Cosmos.useControlValue('Force Internet Explorer', false);
	const isForceInvalidLayout = Cosmos.useControlValue('Force Invalid Layout', false);

	return (
		<InvalidCheck
			forceAlertMessages={alertMessages}
			isForceInternetExplorer={isForceInternetExplorer}
			isForceInvalidLayout={isForceInvalidLayout}
			error={null}
		>
			<Flex>

				<ThemePicker />
				<ErrorThrower />
			</Flex>
		</InvalidCheck>
	);
}, {
	hasMargin: true
});

const ErrorThrower: React.FC = () => {

	const [isError, setIsError] = React.useState(false);

	function onClick() {
		setIsError(true);
	}

	if (isError) {
		throw new Error('Error while rendering!');
	}

	return (
		<div onClick={onClick}>
			<Paragraph>
				Click here to cause an error!
			</Paragraph>
		</div>
	);
};