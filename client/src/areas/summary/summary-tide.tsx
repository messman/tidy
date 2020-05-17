import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
//import { useCurrentTheme } from '@/core/style/theme';
import { ContextBlock } from './context-block';
import { FlexRow, Flex } from '@/core/layout/flex';

export const SummaryTide: React.FC = () => {
	return (
		<ContextBlock
			Primary={SummaryTidePrimary}
			Secondary={SummaryTideSecondary}
		/>
	);
};

const SummaryTidePrimary: React.FC = () => {

	const allResponseState = useAllResponse();
	//const theme = useCurrentTheme();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	//const { all } = allResponseState.data!;

	return (
		<Flex>
			<FlexRow alignItems='center'>
				<Flex>
					<Text>1</Text>
					<Text>1</Text>
				</Flex>
				<Flex flex={2}>

					<Text>1</Text>
				</Flex>
				<Flex>

					<Text>1</Text>
				</Flex>
			</FlexRow>
			<FlexRow>
				<Text>2</Text>
				<Text>2</Text>
				<Text>2</Text>
			</FlexRow>
			<FlexRow>
				<Text>3</Text>
				<Text>4</Text>
				<Text>4</Text>
			</FlexRow>
		</Flex>
	);
};

const SummaryTideSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	//const theme = useCurrentTheme();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	//const { all } = allResponseState.data!;

	return (
		<Text>Hello</Text>
	);
};