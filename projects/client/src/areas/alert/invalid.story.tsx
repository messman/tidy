import * as React from 'react';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { TextPara } from '@/core/symbol/text';
import { decorateWith } from '@/test/storybook/decorate';
import { defaultLowerBreakpoints, Flex, FlexRoot, WindowDimensionsProvider, WindowLayoutProvider } from '@messman/react-common';
import { boolean, text } from '@storybook/addon-knobs';
import { ThemePicker } from '../settings/theme-picker';
import { InvalidCheck } from './invalid';

export default { title: 'areas/alert' };

// Use a custom wrapper, so that we can customize the component we are testing.
// Exclude the wrapper pieces that we don't need for this test.
// Note - always do format {story()) - see main decorator code for more info.
const WrapperDecorator = (story: () => JSX.Element) => {
	return (
		<LocalStorageThemeProvider>
			<WindowDimensionsProvider>
				<WindowLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
					<FlexRoot>
						{story()}
					</FlexRoot>
				</WindowLayoutProvider>
			</WindowDimensionsProvider>
		</LocalStorageThemeProvider>
	);
};

export const TestInvalid = decorateWith(() => {

	// Set up knobs.
	const isForceAlertMessages = boolean('Force Alert Messages', false, 'Build Alert');
	const firstAlertMessage = text('First Alert Message', 'Houston, we have a problem.', 'Build Alert');
	const secondForceAlertMessage = text('Second Alert Message', 'but we probably do not know what that problem is.', 'Build Alert');

	// Require checkbox before we pass any strings.
	const alertMessages = [];
	if (isForceAlertMessages && firstAlertMessage) {
		alertMessages.push(firstAlertMessage);
		if (secondForceAlertMessage) {
			alertMessages.push(secondForceAlertMessage);
		}
	}

	const isForceInternetExplorer = boolean('Force Internet Explorer', false);
	const isForceInvalidLayout = boolean('Force Invalid Layout', false);

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
}, [WrapperDecorator]);

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
			<TextPara>
				Click here to cause an error!
			</TextPara>
		</div>
	);
};