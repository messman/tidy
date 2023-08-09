import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { MediumBodyText } from '../text/text-shared';
import { PanelPadded, PanelTitled, SpacePanelEdge, SpacePanelGridPadding } from './layout-panel';

const PanelContainer = styled.div`
	padding: ${SpacePanelGridPadding.value};
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow: auto;;
`;

export default {
	'Panel Padded': CosmosFixture.create(() => {

		function panel() {
			return (
				<PanelPadded>
					<MediumBodyText>Hello!</MediumBodyText>
					<MediumBodyText>Hello!</MediumBodyText>
					<MediumBodyText>Hello!</MediumBodyText>
					<MediumBodyText>Hello!</MediumBodyText>
				</PanelPadded>
			);
		}

		return (
			<PanelContainer>
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
			</PanelContainer>
		);
	}, {
		setup: FixtureSetup.root
	}),
	'Panel Titled': CosmosFixture.create(() => {

		const title = Cosmos.useControlValue("Title", "Title");

		function panel() {
			return (
				<>
					<PanelTitled title={title}>
						<SpacePanelEdge.PadA>
							<MediumBodyText>Hello!</MediumBodyText>
							<MediumBodyText>Hello!</MediumBodyText>
						</SpacePanelEdge.PadA>
					</PanelTitled>
				</>
			);
		}

		return (
			<PanelContainer>
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
				{panel()}
			</PanelContainer>
		);
	}, {
		setup: FixtureSetup.root
	}),
};