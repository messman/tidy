import * as React from 'react';
import styled from 'styled-components';
import { Panel } from '@/index/core/layout/layout-panel';
import { borderRadiusStyle } from '@/index/core/primitive/primitive-design';
import { themeTokens } from '@/index/core/theme/theme-root';
import { useElementSize, useLatestForLayoutEffect } from '@messman/react-common';
import { VisualCssFoam } from './visual-css-foam';
import { VisualCssFootprints } from './visual-css-footprints';
import { VisualCssRoad } from './visual-css-road';
import { VisualCssSand } from './visual-css-sand';
import { perspectiveStyle, useVisualCssDimensions, visualCssConstant } from './visual-css-shared';
import { VisualCssText } from './visual-css-text';
import { VisualCssWall } from './visual-css-wall';
import { VisualCssWater } from './visual-css-water';

interface Rotation {
	x: number;
	z: number;
}

const rotationXMin = 10; // How top-down the view can be
const rotationXDefault = 50;
const rotationXMax = 80; // How scrunched the view can be

const rotationZMin = -85; // How far down the beach you can look
const rotationZDefault = -20;
const rotationZMax = -15; // How straight-on you can look


const defaultRotation: Rotation = { z: rotationZDefault, x: rotationXDefault };

export interface VisualCssProps {
	waterLevelHeight: number;
};

/**
 * 
 * Creates a 3D isometric diorama illustration of the beach.
 * 
 * Like https://codepen.io/alchemist107/pen/LYGdzjL
 * 
 */
export const VisualCss: React.FC<VisualCssProps> = (props) => {
	const { waterLevelHeight } = props;

	const [scale, setScale] = React.useState(-1);

	const refSize = useElementSize(10, (width, _height) => {
		const clamped = Math.min(10000, Math.max(10, width));
		const scale = clamped / 275; // arbitrary
		setScale(scale);
	});

	const [rotationState, setRotationState] = React.useState<{ startRotation: Rotation; activeRotation: Rotation; }>(() => {
		return {
			startRotation: defaultRotation,
			activeRotation: defaultRotation
		};
	});

	const dimensions = useVisualCssDimensions(waterLevelHeight);

	const refContainer = React.useRef<HTMLDivElement>(null!);
	useDrag(refContainer,
		() => {
			setRotationState((p) => {
				return {
					...p,
					startRotation: { ...p.activeRotation },
				};
			});
		},
		({ start, position }) => {
			const [newX, newY] = position;
			const [startX, startY] = start;
			const diffX = newX - startX;
			const diffY = newY - startY;

			const zDegrees = Math.round((-diffX / 3) * 10) / 10;
			const xDegrees = Math.round((-diffY / 3) * 10) / 10;

			setRotationState((p) => {

				return {
					...p,
					activeRotation: {
						z: Math.min(rotationZMax, Math.max(rotationZMin, p.startRotation.z + zDegrees)),
						x: Math.min(rotationXMax, Math.max(rotationXMin, p.startRotation.x + xDegrees))
					}
				};
			});
		},
		() => {
			// In the future: add a timer, then animate back?
		}
	);

	const { x, z } = rotationState.activeRotation;
	const transform = `rotateX(${x}deg) rotateZ(${z}deg) scale(${scale}) scaleZ(${scale})  translateZ(-${visualCssConstant.wallHeight / 2}px)`;

	return (
		<Panel>
			<div ref={refSize}>
				<BeachDiagram_Container ref={refContainer}>
					{scale !== -1 && (
						<BeachDiagram_Platform style={{ transform }}>
							<PlatformBaseHeightSide />
							<PlatformBaseWidthSide />
							<PlatformBaseTop />
							<VisualCssRoad />
							<VisualCssWall />
							<VisualCssSand dimensions={dimensions}>
								<VisualCssFootprints dimensions={dimensions} />
								<VisualCssFoam dimensions={dimensions} />
								{/* <p>Z: {z.toString()} X: {x.toString()}</p> */}
							</VisualCssSand>
							<VisualCssWater dimensions={dimensions}>
							</VisualCssWater>
							<VisualCssText dimensions={dimensions} />
						</BeachDiagram_Platform >
					)}
				</BeachDiagram_Container>
			</div>
		</Panel>
	);
};

/** Non-3d container */
const BeachDiagram_Container = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	aspect-ratio: 4 / 3;
	overflow: hidden;
	cursor: move;
	touch-action: none; // Disable scroll of page
	${borderRadiusStyle}
	${perspectiveStyle}
`;

/** The invisible "ground" upon which our animation sits. Is transformed so that it stays in the center of the parent. */
const BeachDiagram_Platform = styled.div`
	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.platformHeightTotal}px;
	position: relative;
	transform-origin: 50% 50%;
	transform-style: preserve-3d;
	perspective: inherit;
	${perspectiveStyle}
`;

const PlatformBaseTop = styled.div`
	position: absolute;
	top: -${visualCssConstant.platformOffsetSize}px;
	left: -${visualCssConstant.platformOffsetSize}px;
	width: ${(visualCssConstant.platformOffsetSize * 2) + visualCssConstant.platformWidthBeachLength}px;
	height: ${(visualCssConstant.platformOffsetSize * 2) + visualCssConstant.platformHeightTotal}px;
	background-color: ${themeTokens.beachDiagram.baseTop};
`;

const PlatformBaseHeightSide = styled.div`
	position: absolute;
	top: -${visualCssConstant.platformOffsetSize}px;
	left: -${visualCssConstant.platformOffsetSize}px;
	width: ${visualCssConstant.platformBaseSize}px;
	height: ${(visualCssConstant.platformOffsetSize * 2) + visualCssConstant.platformHeightTotal}px;

	background-color: ${themeTokens.beachDiagram.baseSide};
	
	transform-origin: 0 0;
	transform: rotateY(90deg);
`;

const PlatformBaseWidthSide = styled.div`
	position: absolute;
	bottom: -${visualCssConstant.platformOffsetSize}px;
	left: -${visualCssConstant.platformOffsetSize}px;
	width: ${(visualCssConstant.platformOffsetSize * 2) + visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.platformBaseSize}px;

	background-color: ${themeTokens.beachDiagram.base};

	transform-origin: 0 100%;
	transform: rotateX(90deg);
`;

type Position = [x: number, y: number];

interface DragStartState {
	id: number;
	bounds: DOMRect;
	position: Position;
}

function getRelativePosition(elementBounds: DOMRect, event: PointerEvent): Position {
	const { x, y } = elementBounds;
	const { clientX, clientY } = event;

	return [Math.round(clientX - x), Math.round(clientY - y)];
}

interface DragEvent {
	start: Position;
	startBounds: DOMRect;
	position: Position;
}

function useDrag(ref: React.RefObject<HTMLElement>, onDragStart: () => void, onDrag: (event: DragEvent) => void, onDragEnd: () => void): void {

	const [dragStart, setDragStart] = React.useState<DragStartState | null>(null);

	const refOnStart = useLatestForLayoutEffect(onDragStart);
	const refOnDrag = useLatestForLayoutEffect(onDrag);
	const refOnEnd = useLatestForLayoutEffect(onDragEnd);


	React.useLayoutEffect(() => {
		const element = ref.current!;

		function onPointerDown(e: PointerEvent): void {

			refOnStart.current();

			setDragStart((p) => {
				if (p) {
					return p;
				}

				const bounds = element.getBoundingClientRect();
				return {
					id: e.pointerId,
					bounds,
					position: getRelativePosition(bounds, e)
				};
			});
		}

		element.addEventListener('pointerdown', onPointerDown);

		return () => {
			element.removeEventListener('pointerdown', onPointerDown);
		};
	}, []);


	React.useLayoutEffect(() => {
		if (!dragStart) {
			return;
		}
		const element = ref.current!;

		const { id, position: startPosition, bounds: startBounds } = dragStart;
		element.setPointerCapture(id);

		function move(e: PointerEvent) {
			refOnDrag.current({
				start: startPosition,
				// Assume bounds are unchanged
				startBounds: startBounds,
				// Assume bounds are unchanged
				position: getRelativePosition(startBounds, e)
			});
		}

		function stopDrag() {
			element.releasePointerCapture(id);
			setDragStart(null);
			refOnEnd.current();
		}

		document.addEventListener('pointerup', stopDrag);
		document.addEventListener('pointercancel', stopDrag);
		document.addEventListener('pointermove', move);

		return () => {
			document.removeEventListener('pointerup', stopDrag);
			document.removeEventListener('pointercancel', stopDrag);
			document.removeEventListener('pointermove', move);
		};

	}, [dragStart]);


}