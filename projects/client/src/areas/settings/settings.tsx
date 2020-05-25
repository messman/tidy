import { DateTime } from 'luxon';
import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { addMargin, flowPaddingValue, Link } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { ThemePicker } from '@/core/style/theme';
import { Text, textHeight, TitleInline } from '@/core/symbol/text';
import { useLocalDataPhrase } from '@/services/data/data-local';
import { DEFINE } from '@/services/define';

export interface SettingsProps {

}

export const Settings: React.FC<SettingsProps> = () => {

	let localDataPicker: JSX.Element | null = null;
	if (!!DEFINE.localTestData) {
		localDataPicker = <LocalDataPicker />;
	}

	return (
		<OverflowFlex>
			<Margin>
				<FlexRow justifyContent='space-between'>
					<TitleInline>
						Tidy
					</TitleInline>
					<ThemePicker />
				</FlexRow>
			</Margin>
			<MarginText>
				Tidy provides present and future information on tides, sunrise/sunset, and weather for Wells, Maine.
			</MarginText>
			<MarginText>
				Tidy cannot guarantee the accuracy of any provided data. Data is sourced from public NOAA and NWS interfaces.
			</MarginText>
			<MarginText>
				Tidy is a work-in-progress and will change throughout 2020 as fixes and features are implemented.
			</MarginText>
			<Margin>
				<FlexRow>
					<Flex>
						<TextTitle>Version</TextTitle>
						<TextTitle>Built</TextTitle>
					</Flex>
					<Flex flex={2}>
						<Text>{DEFINE.buildVersion}</Text>
						<Text>{DateTime.fromMillis(DEFINE.buildTime).toLocaleString()}</Text>
					</Flex>
				</FlexRow>
			</Margin>
			<Margin>
				<TextTitle>Designer &amp; Developer</TextTitle>
				<Text>Andrew Messier | <Link href='https://andrewmessier.com'>andrewmessier.com</Link></Text>
			</Margin>
			<Margin>
				<TextTitle>For</TextTitle>
				<Text>Mark &amp; Dawna Messier and all residents or visitors to Wells, Maine</Text>
			</Margin>
			<Margin>
				For attributions, source code, reporting issues, or contacting the developer,
				please see <Link href='https://github.com/messman/tidy'>GitHub</Link>
			</Margin>
			{localDataPicker}
		</OverflowFlex>
	);
};

const OverflowFlex = styled(Flex)`
	overflow-y: auto;
`;

const Margin = styled.div`
	margin: ${flowPaddingValue};
`;

const MarginText = addMargin(Text, flowPaddingValue);

const TextTitle = styled(Text)`
	text-transform: uppercase;
	margin-bottom: .1rem;
`;

const LocalDataPicker: React.FC = () => {

	const [localDataPhrase, setLocalDataPhrase] = useLocalDataPhrase();
	const notUsingLocalDataPhrase = 'REAL';

	const localDataOptions = [notUsingLocalDataPhrase];
	Object.keys(DEFINE.localTestData!).forEach((phrase) => {
		localDataOptions.push(phrase);
	});

	const options = localDataOptions.map((phrase) => {
		return <option key={phrase} value={phrase} >{phrase}</option>;
	});

	function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
		const value = event.target.value;
		const newPhrase = value === notUsingLocalDataPhrase ? null : value;
		setLocalDataPhrase(newPhrase);
	}

	const selectedPhrase = localDataPhrase === null ? notUsingLocalDataPhrase : localDataPhrase;
	return (
		<Margin>
			<TextTitle>Data</TextTitle>
			<StyledSelect defaultValue={selectedPhrase} onChange={onChange}>
				{options}
			</StyledSelect>
		</Margin>
	);
};


const StyledSelect = styled.select`
	display: inline-block;
	font-size: ${textHeight};
	color: ${p => p.theme.color.textAndIcon};
	margin: 0;
	padding: .5rem;
	border: 1px solid transparent;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: ${p => p.theme.color.backgroundLighter};

	&:hover {
		border-color: ${p => p.theme.color.context};
	}
	&:focus {
		border-color: ${p => p.theme.color.context};
		outline: none;
	}
`;
