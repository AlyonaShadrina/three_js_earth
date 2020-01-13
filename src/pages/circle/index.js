import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import "../../navigation";
import "../../style.css";

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCircles } from './circles';
import { mouseListener } from './mouseListener';


const radius = 7;

const basic = new ThreeSceneBuilder();
basic.initRenderer()
    .initScene({
        background: new THREE.Color('#e1d1c2'),
    })
    .initCamera()
    .initLight()
    .createMesh({
        geometry: {
            type: 'Ring',
            props: [radius, radius + .5, radius * 15],
        },
        material: {
            type: 'Basic',
            props: {
                color: '#1c2124',
            },
        },
        name: 'ring'
    });

// addLines(basic, 10, radius);
addCircles(basic, 8, radius);

// basic.addEventListener({
//     type: 'mousemove',
//     listener: mouseListener,
// });

const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = [65, 83, 68];

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
    controls.update();
}


