import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { fontStyleDeclarations } from '../text';
import { Spacing } from '../theme/box';
import { css, styled } from '../theme/styled';
import { SlideReplace, SlideReplaceChild } from './replace';

enum Page {
	a = 'A',
	b = 'B',
	c = 'C'
}
const pageEnumSelect = Cosmos.createControlSelectForEnum(Page);

export default CosmosFixture.create(() => {

	const page = Cosmos.useControlSelect('Page', pageEnumSelect, 'b');

	return (
		<Container>
			<SlideReplace activeId={page}>
				<SlideReplaceChild id={Page.a}>
					<PageA />
				</SlideReplaceChild>
				<SlideReplaceChild id={Page.b}>
					<PageB />
				</SlideReplaceChild>
				<SlideReplaceChild id={Page.c}>
					<PageC />
				</SlideReplaceChild>
			</SlideReplace>
		</Container>
	);
}, {
	container: FixtureContainer.none
});

const Container = styled.div`
	flex: 1;
	display: flex;
	align-items: stretch;
`;

function useMountUnmount(page: string, onMountUnmount: () => number): string {
	const valueRef = React.useRef<number>(null!);
	if (valueRef.current === null) {
		valueRef.current = onMountUnmount();
	}
	React.useEffect(() => {
		console.log('MOUNT ' + page);
	}, []);
	return valueRef.current.toString();
}

const commonPageContainerStyles = css`
	flex: 1;
	background-color: ${p => p.theme.common.system.blue.d_lightest};
	${fontStyleDeclarations.display1};
	color: ${p => p.theme.textDistinct};
	padding: ${Spacing.dog16};
`;

const PageAContainer = styled.div`
	${commonPageContainerStyles};
	background-color: ${p => p.theme.common.system.blue.d_lightest};
`;

let mountA = 0;
const PageA: React.FC = () => {
	const unique = useMountUnmount('A', () => { return ++mountA; });
	return (
		<PageAContainer>Page A - {unique}</PageAContainer>
	);
};

const PageBContainer = styled.div`
	${commonPageContainerStyles};
	background-color: ${p => p.theme.common.system.green.d_lightest};
`;

let mountB = 0;
const PageB: React.FC = () => {
	const unique = useMountUnmount('B', () => { return ++mountB; });
	return (
		<PageBContainer>Page B - {unique}</PageBContainer>
	);
};

const PageCContainer = styled.div`
	${commonPageContainerStyles};
	background-color: ${p => p.theme.common.system.red.d_lightest};
`;

let mountC = 0;
const PageC: React.FC = () => {
	const unique = useMountUnmount('C', () => { return ++mountC; });
	return (
		<PageCContainer>Page C - {unique}</PageCContainer>
	);
};
