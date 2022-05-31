// import { DateTime } from 'luxon';
// import * as React from 'react';
// import { addMargin, flowPaddingValue, Link } from '@/core/style/common';
// import { Text, textHeight, TitleInline } from '@/core/text';
// import { styled } from '@/core/theme/styled';
// import { hasAllResponseData, useAllResponse } from '@/services/data/data';
// import { useLocalDataPhrase } from '@/services/data/data-local';
// import { useDefine } from '@/services/define';
// import { ThemePicker } from './theme-picker';

// export interface SettingsProps {

// }

// export const Settings: React.FC<SettingsProps> = () => {

// 	const { localTestData, buildTime, buildVersion } = useDefine();

// 	const allResponseState = useAllResponse();
// 	if (!hasAllResponseData(allResponseState)) {
// 		return null;
// 	}

// 	let localDataPicker: JSX.Element | null = null;
// 	if (!!localTestData) {
// 		localDataPicker = <LocalDataPicker />;
// 	}

// 	return (
// 		<OverflowFlex>
// 			<Margin>
// 				<FlexRow justifyContent='space-between'>
// 					<TitleInline>
// 						Tidy
// 					</TitleInline>
// 					<Flex flex='0'>
// 						<ThemePicker />
// 					</Flex>
// 				</FlexRow>
// 			</Margin>
// 			<MarginText>
// 				Tidy provides present and future information on tides, sunrise/sunset, and weather for Wells, Maine.
// 			</MarginText>
// 			<MarginText>
// 				Tidy cannot guarantee the accuracy of any provided data. Data is sourced from NOAA and OpenWeather. All tide heights are predictions with the exception of the current measured tide height.
// 			</MarginText>
// 			<MarginText>
// 				Tidy is an active work-in-progress; check back periodically to see what's new.
// 			</MarginText>
// 			<Margin>
// 				<FlexRow>
// 					<Flex>
// 						<TextTitle>Version</TextTitle>
// 						<TextTitle>Built</TextTitle>
// 					</Flex>
// 					<Flex flex={2}>
// 						<Text>{buildVersion}</Text>
// 						<Text>{DateTime.fromMillis(buildTime).toLocaleString()}</Text>
// 					</Flex>
// 				</FlexRow>
// 			</Margin>
// 			<Margin>
// 				<TextTitle>Designer &amp; Developer</TextTitle>
// 				<Text>Andrew Messier | <Link href='https://andrewmessier.com'>andrewmessier.com</Link></Text>
// 			</Margin>
// 			<Margin>
// 				<TextTitle>For</TextTitle>
// 				<Text>Mark &amp; Dawna Messier and all residents or visitors to Wells, Maine</Text>
// 			</Margin>
// 			<Margin>
// 				For attributions, source code, reporting issues, or contacting the developer,
// 				please see <Link href='https://github.com/messman/tidy'>GitHub</Link>
// 			</Margin>
// 			{localDataPicker}
// 		</OverflowFlex>
// 	);
// };

// const OverflowFlex = styled(Flex)`
// 	overflow-y: auto;
// `;

// const Margin = styled.div`
// 	margin: ${flowPaddingValue};
// `;

// const MarginText = addMargin(Text, flowPaddingValue);

// const TextTitle = styled(Text)`
// 	text-transform: uppercase;
// 	margin-bottom: .1rem;
// `;

// const LocalDataPicker: React.FC = () => {

// 	const { localTestData } = useDefine();

// 	const [localDataPhrase, setLocalDataPhrase] = useLocalDataPhrase();
// 	const notUsingLocalDataPhrase = 'REAL';

// 	const localDataOptions = [notUsingLocalDataPhrase];
// 	Object.keys(localTestData!).forEach((phrase) => {
// 		localDataOptions.push(phrase);
// 	});

// 	const options = localDataOptions.map((phrase) => {
// 		return <option key={phrase} value={phrase} >{phrase}</option>;
// 	});

// 	function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
// 		const value = event.target.value;
// 		const newPhrase = value === notUsingLocalDataPhrase ? null : value;
// 		setLocalDataPhrase(newPhrase);
// 	}

// 	const selectedPhrase = localDataPhrase === null ? notUsingLocalDataPhrase : localDataPhrase;
// 	return (
// 		<Margin>
// 			<TextTitle>Data</TextTitle>
// 			<StyledSelect defaultValue={selectedPhrase} onChange={onChange}>
// 				{options}
// 			</StyledSelect>
// 		</Margin>
// 	);
// };


// const StyledSelect = styled.select`
// 	display: inline-block;
// 	font-size: ${textHeight};
// 	color: ${p => p.theme.color.textAndIcon};
// 	margin: 0;
// 	padding: .5rem;
// 	border: 1px solid transparent;
// 	-moz-appearance: none;
// 	-webkit-appearance: none;
// 	appearance: none;
// 	background-color: ${p => p.theme.color.backgroundLighter};

// 	&:hover {
// 		border-color: ${p => p.theme.color.context};
// 	}
// 	&:focus {
// 		border-color: ${p => p.theme.color.context};
// 		outline: none;
// 	}
// `;
