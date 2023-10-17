// import * as React from 'react';
// import styled from 'styled-components';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// /*
// 	Inspiration:
// 	- https://breezy.netlify.app/ / https://github.com/claytercek/Breezy
// 	- Dioramas: https://www.pinterest.com/pin/575827502340050060/
// 	- https://jsfiddle.net/z2mkjn8t/1/
// */

// export interface BeachVisualProps {
// 	height: number;
// };

// export const BeachVisual: React.FC<BeachVisualProps> = (props) => {
// 	const { height } = props;

// 	const refCanvas = React.useRef<HTMLCanvasElement>(null!);

// 	React.useLayoutEffect(() => {
// 		const canvas = refCanvas.current;
// 		const { width, height } = canvas;

// 		const scene = new THREE.Scene();

// 		const aspect = width / height;
// 		const d = 20;
// 		const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, .0001, 1000);

// 		camera.position.set(-20, 10, 20);
// 		camera.rotation.order = 'YXZ';
// 		camera.rotation.y = - Math.PI / 4;
// 		camera.rotation.x = Math.atan(- 1 / Math.sqrt(2));

// 		const renderer = new THREE.WebGLRenderer({
// 			canvas,
// 			alpha: true,
// 			premultipliedAlpha: false,
// 		});
// 		renderer.setSize(width, height);

// 		// controls
// 		const controls = new OrbitControls(camera, renderer.domElement);
// 		controls.addEventListener('change', animate);
// 		controls.enableZoom = false;
// 		controls.enablePan = false;
// 		controls.maxPolarAngle = Math.PI / 2;

// 		// ambient
// 		scene.add(new THREE.AmbientLight('#ddd', .75));

// 		// light
// 		const light = new THREE.PointLight('#FFF', 1500);
// 		light.position.set(0, 50, 50);
// 		scene.add(light);

// 		const helper = new THREE.PointLightHelper(light);
// 		scene.add(helper);

// 		// axes
// 		scene.add(new THREE.AxesHelper(40));


// 		// Wall
// 		{
// 			const geometry = new THREE.BoxGeometry(100, 10, 4);

// 			const material = new THREE.MeshToonMaterial({ color: '#DDD' });
// 			material.side = THREE.DoubleSide;

// 			const mesh = new THREE.Mesh(geometry, material);
// 			mesh.position.add(new THREE.Vector3(0, 5, -22));

// 			scene.add(mesh);
// 		}

// 		// Sand
// 		{

// 		}

// 		function animate() {
// 			requestAnimationFrame(animate);

// 			renderer.render(scene, camera);
// 		}

// 		animate();

// 	}, [height]);

// 	return (
// 		<Canvas ref={refCanvas} width={400} height={300} />
// 	);
// };

// const Canvas = styled.canvas`
// 	width: 400px;
// 	height: 300px;
// 	outline: 1px solid red;
// `;