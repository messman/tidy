import * as React from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@/index/core/form/button';
import { themeTokens } from '@/index/core/theme/theme-root';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { ElementIntersect, useElementIntersect } from '@messman/react-common';
import { Swipe } from './layout-swipe';

export default {
	'Multi': CosmosFixture.create(() => {

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
					<Button onClick={createOnClickFor(intersectRefRed)}>Red</Button>
					<Button onClick={createOnClickFor(intersectRefBlue)}>Blue</Button>
					<Button onClick={createOnClickFor(intersectRefGreen)}>Green</Button>
				</div>
				<Multi_Container ref={ref}>
					<Multi_Red ref={intersectRefRed} />
					<Multi_Blue ref={intersectRefBlue} />
					<Multi_Green ref={intersectRefGreen} />
				</Multi_Container>
			</>
		);
	}, {
		setup: FixtureSetup.root
	}),
	'Swipe': CosmosFixture.create(() => {

		const [isActive, setIsActive] = React.useState(false);

		return (
			<RootContainer>
				<MainContent>
					Back content here... this is the stuff that will disappear
					Is Active: {isActive ? 'Yes' : 'No'}
					<div>
						<button onClick={() => { setIsActive(true); }}>Open</button>
					</div>
				</MainContent>
				<Swipe
					title='Content'
					isActive={isActive}
					onSetInactive={() => { setIsActive(false); }}
				>
					<div>
						<p>Hello!</p>
					</div>
				</Swipe>
			</RootContainer >
		);
	}, {
		setup: FixtureSetup.root
	})
};

const Multi_Container = styled.div`
	flex: 1;
	display: flex;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
`;

const multiStyle = css`
	width: 100vw;
	height: 100vh;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	flex-shrink: 0;
`;

const Multi_Red = styled.div`
	${multiStyle}
	background-color: ${themeTokens.rawColor.red.subtle};
`;

const Multi_Blue = styled.div`
	${multiStyle}
	background-color: ${themeTokens.rawColor.blue.subtle};
`;

const Multi_Green = styled.div`
	${multiStyle}
	background-color: ${themeTokens.rawColor.green.subtle};
`;

const RootContainer = styled.div`
	position: relative;
	flex: 1;
	display: flex;
	align-items: stretch;
	overflow: hidden;
`;

const MainContent = styled.div`
	flex: 1;
	padding: 1rem;
`;