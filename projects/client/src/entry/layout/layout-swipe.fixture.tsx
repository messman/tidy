import * as React from 'react';
import styled, { css } from 'styled-components';
import { ButtonSecondary } from '@/core/form/button';
import { themeTokens } from '@/core/theme';
import { CosmosFixture } from '@/test';
import { fixtureDefault } from '@/test/cosmos-fixture';
import { ElementIntersect, useElementIntersect } from '@messman/react-common';

export default CosmosFixture.create(() => {

	const ref = React.useRef<HTMLDivElement>(null!);

	const [active, setActive] = React.useState('red');

	const threshold = .75;

	function determineSetActive(key: string, intersect: ElementIntersect) {
		if (intersect.intersectionRatio > threshold) {
			setActive(key);
			console.log(key, intersect);
		}
	}

	const intersectRefRed = useElementIntersect({
		rootRef: ref,
		threshold
	}, (intersect) => {
		determineSetActive('red', intersect);
	});

	const intersectRefBlue = useElementIntersect({
		rootRef: ref,
		threshold
	}, (intersect) => {
		determineSetActive('blue', intersect);
	});

	const intersectRefGreen = useElementIntersect({
		rootRef: ref,
		threshold
	}, (intersect) => {
		determineSetActive('green', intersect);
	});


	function createOnClickFor(ref: React.RefObject<HTMLDivElement>) {
		return () => {
			if (ref.current) {
				ref.current.scrollIntoView({
					behavior: 'smooth',
					inline: 'start'
				});
			}
		};
	}

	return (
		<>
			<div>
				active: {active}
			</div>
			<div>
				<ButtonSecondary onClick={createOnClickFor(intersectRefRed)}>Red</ButtonSecondary>
				<ButtonSecondary onClick={createOnClickFor(intersectRefBlue)}>Blue</ButtonSecondary>
				<ButtonSecondary onClick={createOnClickFor(intersectRefGreen)}>Green</ButtonSecondary>
			</div>
			<Container ref={ref}>
				<RedSwipe ref={intersectRefRed} />
				<BlueSwipe ref={intersectRefBlue} />
				<GreenSwipe ref={intersectRefGreen} />
			</Container>
		</>
	);
}, {
	setup: fixtureDefault.root
});

const Container = styled.div`
	flex: 1;
	display: flex;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
`;

const swipeStyle = css`
	width: 100vw;
	height: 100%;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	flex-shrink: 0;
`;

const RedSwipe = styled.div`
	${swipeStyle}
	background-color: ${themeTokens.rawColor.red.subtle};
`;

const BlueSwipe = styled.div`
	${swipeStyle}
	background-color: ${themeTokens.rawColor.blue.subtle};
`;

const GreenSwipe = styled.div`
	${swipeStyle}
	background-color: ${themeTokens.rawColor.green.subtle};
`;