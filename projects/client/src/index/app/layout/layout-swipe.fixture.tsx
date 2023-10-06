import * as React from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@/index/core/form/button';
import { themeTokens } from '@/index/core/theme/theme-root';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { ElementIntersect, useElementIntersect } from '@messman/react-common';
import { Swipe } from './layout-swipe';
import { SwipeHeader } from './layout-swipe-header';

type Log = {
	value: number;
	queue: number;
	time: number;
};

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

		const refMain = React.useRef<HTMLDivElement>(null!);

		const refLog = React.useRef<Log[]>([]);
		const [capturedLog, setCapturedLog] = React.useState<null | (Log[])>(null);

		function clickToggleLog() {
			setCapturedLog((p) => {
				if (!p) {
					const log = refLog.current;
					refLog.current = [];
					return log;
				}
				return null;
			});
		}
		/*
			Back
				
			Front
				Equal Space
				Front Content
		*/

		const logText = React.useMemo(() => {
			return capturedLog ? capturedLog.map(({ value, queue, time }) => `value|${value} queue=${queue} time=${time}`).join('\n') : '';
		}, [capturedLog]);

		const logRender = logText ? (
			<Swipe_Log>
				<div>
					<button onClick={clickToggleLog}>Log</button>
				</div>
				<pre>
					{logText}
				</pre>
			</Swipe_Log>
		) : null;

		return (
			<Swipe_RootContainer>
				<Swipe_Main ref={refMain}>
					Back content here... this is the stuff that will disappear
					<div>
						<button onClick={() => { setIsActive(true); }}>Open</button>
					</div>
					<div>
						<button onClick={clickToggleLog}>Log</button>
					</div>
				</Swipe_Main>
				<Swipe
					contentRef={refMain}
					isActive={isActive}
					onSetInactive={() => { setIsActive(false); }}
				>
					<SwipeHeader
						backToSectionText='Content'
						onSetInactive={() => { setIsActive(false); }}
					/>
				</Swipe>
				{logRender}
			</Swipe_RootContainer >
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
	height: 100%;
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

const Swipe_RootContainer = styled.div`
	position: relative;
	flex: 1;
	display: flex;
	align-items: stretch;
	overflow: hidden;

`;

const Swipe_Main = styled.div`
	will-change: transform;
	/* transition: transform .1s ease; */
	flex: 1;
	z-index: 0;
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
	top: 0;
	background-color: ${themeTokens.rawColor.green.subtle};
	padding: 1rem;
`;

const Swipe_Log = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
	padding: 1rem;
	background-color: white;
	color: black;
	overflow: scroll;
`;