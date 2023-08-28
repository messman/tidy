import * as React from 'react';
import styled from 'styled-components';
import { PanelTitled, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { Spacing } from '@/index/core/primitive/primitive-design';

const NowBeachAccess_Body = styled.div`
	padding: ${SpacePanelEdge.value};
	padding-top: ${Spacing.dog16};
`;

export interface NowBeachAccessProps {

};

/** */
export const NowBeachAccess: React.FC<NowBeachAccessProps> = (props) => {
	const { } = props;

	return (
		<PanelTitled title='"Can We Go Out On The Beach?"'>
			<NowBeachAccess_Body>

			</NowBeachAccess_Body>
		</PanelTitled>
	);
};