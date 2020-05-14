import * as React from 'react';
import { LocalStorageThemeProvider } from '@/core/style/theme';
import { Text } from '@/core/symbol/text';
import { AllResponseProvider } from '@/services/data/data';
import { defaultLowerBreakpoints, ResponsiveLayoutProvider } from '@/services/layout/responsive-layout';
import { decorateWith } from '@/test/storybook/decorate';
import { boolean, text } from '@storybook/addon-knobs';
import { InvalidCheck } from './invalid';
import { FlexRoot } from '@/core/layout/flex';

export default { title: 'areas/alert' };

// Use a custom wrapper, so that we can customize the component we are testing
const WrapperDecorator = (Story: React.FC) => {
	return (
		<LocalStorageThemeProvider>
			<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
				<AllResponseProvider>
					<FlexRoot>
						<Story />
					</FlexRoot>
				</AllResponseProvider>
			</ResponsiveLayoutProvider>
		</LocalStorageThemeProvider>
	);
};

export const Invalid = decorateWith(() => {

	const isForceAlertMessages = boolean('Force Alert Messages', false, 'Build Alert');
	const firstAlertMessage = text('First Alert Message', 'Houston, we have a problem.', 'Build Alert');
	const secondForceAlertMessage = text('Second Alert Message', 'but we probably do not know what that problem is.', 'Build Alert');

	const alertMessages = [];
	if (isForceAlertMessages && firstAlertMessage) {
		alertMessages.push(firstAlertMessage);
		if (secondForceAlertMessage) {
			alertMessages.push(secondForceAlertMessage);
		}
	}

	const isForceInternetExplorer = boolean('Force Internet Explorer', false);
	const isForceInvalidLayout = boolean('Force Invalid Layout', false);

	// Root can be row or column.
	// Child within must be a flex item.
	return (
		<InvalidCheck
			forceAlertMessages={alertMessages}
			isForceInternetExplorer={isForceInternetExplorer}
			isForceInvalidLayout={isForceInvalidLayout}
		>
			<Text>Everything is okay!</Text>
		</InvalidCheck>
	);
}, [WrapperDecorator]);