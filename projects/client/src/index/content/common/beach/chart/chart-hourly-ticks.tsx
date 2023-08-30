import * as React from 'react';
import styled from 'styled-components';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';

const Tick_ContainerEmpty = styled.div`
	width: 0px;
`;

const Tick_Tick = styled.div`
	width: 1px;
	height: .25rem;
	background-color: ${themeTokens.text.subtle};
	flex-shrink: 0;
`;

const Tick_Text = styled.div`
	${fontStyles.text.tiny}
	color: ${themeTokens.text.subtle};
`;

const Tick_Container = styled.div`
	width: 0px;
	display: flex;
	flex-direction: column;
	gap: .125rem;
	align-items: center;
	flex-shrink: 0;
`;

interface TickProps {
	value?: number;
};

const Tick: React.FC<TickProps> = (props) => {
	const { value } = props;
	return (
		<Tick_Container>
			<Tick_Tick />
			{value !== undefined && <Tick_Text>{value.toString()}</Tick_Text>}
		</Tick_Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const ChartHourlyTicks: React.FC = () => {

	const ticksRender = React.useMemo(() => {
		const ticks: React.ReactNode[] = [];
		for (let i = 1; i <= 23; i++) {
			let hour: number | undefined = i % 12;
			if (hour === 0) {
				hour = 12;
			}
			hour = hour % 2 === 0 ? hour : undefined;
			ticks.push(<Tick key={i} value={hour} />);
		}
		return ticks;
	}, []);

	return (
		<Container>
			<Tick_ContainerEmpty />
			{ticksRender}
			<Tick_ContainerEmpty />
		</Container>
	);
};