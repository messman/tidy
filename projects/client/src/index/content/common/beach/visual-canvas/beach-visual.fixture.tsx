// import * as React from 'react';
// import styled from 'styled-components';
// import { useBatchResponseSuccess } from '@/index/core/data/data';
// import { MediumBodyText } from '@/index/core/text/text-shared';
// import { Cosmos, CosmosFixture } from '@/test';
// import { FixtureSetup } from '@/test/cosmos-fixture';
// import { TideHeightTextUnit } from '../../tide/tide-common';
// import { BeachVisual } from './beach-visual';

// export default CosmosFixture.create(() => {

// 	const { now } = useBatchResponseSuccess();
// 	const currentHeight = now.tide.current.height;

// 	const shouldUseControlHeight = Cosmos.useControlValue('Use Height', false);
// 	const controlHeight = Cosmos.useControlValue<number>('Height', 7.5);

// 	const height = shouldUseControlHeight ? controlHeight : currentHeight;

// 	return (
// 		<Container>
// 			<MediumBodyText>Height: <TideHeightTextUnit height={height} /></MediumBodyText>
// 			<BeachVisual height={height} />
// 		</Container>
// 	);
// }, {
// 	setup: FixtureSetup.root,
// 	isSuccessOnly: true
// });

// const Container = styled.div`
// 	padding: 1rem;
// `;