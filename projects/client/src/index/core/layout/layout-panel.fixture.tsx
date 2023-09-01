import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { constant } from '@wbtdevlocal/iso';
import { MediumBodyText } from '../text/text-shared';
import { Panel, PanelPadding, SpacePanelEdge, SpacePanelGridPadding } from './layout-panel';

const PanelContainer = styled.div`
	padding: ${SpacePanelGridPadding.value};
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow: auto;;
`;

export default {
	'Panel Padding': CosmosFixture.create(() => {

		function panel() {
			return (
				<Panel>
					<PanelPadding>
						<MediumBodyText>Hello! {constant.beachAccess.bestGuessBeachHeight}</MediumBodyText>
						<MediumBodyText>Hello!</MediumBodyText>
						<MediumBodyText>Hello!</MediumBodyText>
						<MediumBodyText>Hello!</MediumBodyText>
					</PanelPadding>
				</Panel>
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
					<Panel title={title}>
						<SpacePanelEdge.PadA>
							<MediumBodyText>Hello!</MediumBodyText>
							<MediumBodyText>Hello!</MediumBodyText>
						</SpacePanelEdge.PadA>
					</Panel>
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