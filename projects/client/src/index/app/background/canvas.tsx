import * as React from 'react';
import styled from 'styled-components';

const DEBUG = false;

export interface RenderInput {
	ctx: CanvasRenderingContext2D | null;
	width: number;
	height: number;
}

export interface CanvasRender {
	(input: RenderInput): void;
}

interface BubbleState {
	key: number;
	width: number;
	height: number;
}

export interface CanvasProps {
	render: CanvasRender | null;
}

export const Canvas: React.FC<CanvasProps> = (props) => {
	const { render } = props;

	const [state, setState] = React.useState<BubbleState>(() => {
		return {
			key: 0,
			width: 0,
			height: 0
		};
	});
	const { key, width, height } = state;

	const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
	// This ref does double-duty as the way to tell when we are cleaning up as well as holding that cleanup function.
	const refCleanup = React.useRef<null | (() => void)>(null);

	const refSetCanvas = React.useCallback((canvas: HTMLCanvasElement | null) => {

		refCanvas.current = canvas;

		// If we have the cleanup ref set, we are cleaning up. So run it.
		if (refCleanup.current) {
			refCleanup.current();
			refCleanup.current = null;
		}

		if (canvas) {

			const ctx = canvas.getContext("2d")!;

			// Listen for changed to devicePixelRatio, which can happen when moving between external monitors.
			const media = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);

			// Resize function.
			function resize() {
				if (!canvas) {
					return;
				}

				const ratio = window.devicePixelRatio || 1;

				var size = canvas.getBoundingClientRect();
				const { width, height } = size;
				if (DEBUG) {
					console.log({ width, height, canvasWidth: canvas.width, canvasHeight: canvas.height });
				}

				// Update canvas "crispness" with the ratio
				canvas.width = width * ratio;
				canvas.height = height * ratio;
				ctx.scale(ratio, ratio);

				setState((p) => {
					return {
						key: p.key + 1,
						width,
						height
					};
				});
			};

			media.addEventListener("change", resize);
			window.addEventListener("resize", resize);

			resize();

			refCleanup.current = () => {
				media.removeEventListener("change", resize);
				window.removeEventListener("resize", resize);
			};
		}
	}, []);

	React.useEffect(() => {
		const canvas = refCanvas.current;

		if (!canvas || !render || key === 0 || !width || !height) {
			return;
		}

		const context = canvas.getContext("2d")!;

		// Set up animation loop
		let requestAnimationFrameId: number = -1;
		function animate() {
			render!({
				ctx: context,
				width,
				height
			});
			requestAnimationFrameId = window.requestAnimationFrame(animate);
		}
		requestAnimationFrameId = window.requestAnimationFrame(animate);

		return () => {
			window.cancelAnimationFrame(requestAnimationFrameId);
			const context = canvas.getContext('2d');
			if (context) {
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
		};
	}, [key, width, height, render]);

	return (
		<CanvasElement ref={refSetCanvas}></CanvasElement>
	);
};


const CanvasElement = styled.canvas`
	position: absolute; 
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;