import { DateTime } from 'luxon';
import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { addMargin, flowPaddingValue, Link } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { ThemePicker } from '@/core/style/theme';
import { Text, TitleInline } from '@/core/symbol/text';
import { DEFINE } from '@/services/define';

export interface SettingsProps {

}

export const Settings: React.FC<SettingsProps> = () => {
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