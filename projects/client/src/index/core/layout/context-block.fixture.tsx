// import * as React from 'react';
// import { Text } from '@/core/text';
// import { Cosmos, CosmosFixture } from '@/test';
// import styled from 'styled-components';
// import { ContextBlock } from './context-block';

// export default CosmosFixture.create(() => {
// 	const isDualMode = Cosmos.useControlValue('Is Dual Mode', false);

// 	return (
// 		<div>
// 			<ContextBlock
// 				primary={<MockPrimary />}
// 				secondary={<MockSecondary />}
// 				isDualMode={isDualMode}
// 			/>
// 		</div>
// 	);
// }, {
// 	hasMargin: true
// });

// const MockPrimary: React.FC = () => {
// 	return (
// 		<Margin>
// 			<Text>Primary</Text>
// 			<Text>Primary</Text>
// 			<Text>Primary</Text>
// 			<Text>Primary</Text>
// 		</Margin>
// 	);
// };

// const MockSecondary: React.FC = () => {
// 	return (
// 		<Margin>
// 			<Text>Secondary</Text>
// 			<Text>Secondary</Text>
// 		</Margin>
// 	);
// };

// const Margin = styled.div`
// 	margin: .5rem;
// `;