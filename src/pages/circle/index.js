import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import "../../navigation";
import "../../style.css";

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCircles } from './circles';
import { addLines } from './lines';


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
addCircles(basic, 1, radius);

const mouseListener = (e, thisThree) => {

    const { domElement } = thisThree.renderer;

    const coordX = e.clientX - domElement.width / 2;
    const coordY = e.clientY - domElement.height / 2;
    const meshes = thisThree.meshes;
    // console.log('thisThree', thisThree);

    // console.log("meshes['ring']", meshes['ring']);
    Object.keys(meshes).map(meshName => {

        const { mesh } = meshes[meshName];

        if (mesh.position && meshName != 'ring') {
            const circleRadius = mesh.geometry.parameters.radius;

            // const mousePosition = {};

            // mousePosition.x = ((e.clientX - thisThree.renderer.domElement.offsetLeft) / thisThree.renderer.domElement.offsetWidth) * 2 - 1;
            // mousePosition.y = -((e.clientY - thisThree.renderer.domElement.offsetTop) / thisThree.renderer.domElement.offsetHeight) * 2 + 1;

            // console.log('mousePosition', mousePosition);

            const initPosition = { ...mesh.position };

            console.log('coordX' ,coordX);

            if (initPosition.x + coordX * (1 / circleRadius * 0.001) + circleRadius <= radius) {
                mesh.position.x += coordX * (1 / circleRadius * 0.001);
            }
            // if (initPosition.x + coordX * (1 / circleRadius * 0.001) + circleRadius <= radius) {
            //     mesh.position.x += coordX * (1 / circleRadius * 0.001);
            // }

            // if (mesh.position.x + circleRadius <= radius) {
            //     mesh.position.x += coordX * (1 / circleRadius * 0.001);
            // } else {
            //     mesh.position.x -= coordX * (1 / circleRadius * 0.001);
            // }

            // if (Math.abs(mesh.position.y) + circleRadius <= radius - (coordY * (1 / circleRadius * 0.001))) {
            //     mesh.position.y += -coordY * (1 / circleRadius * 0.001);
            // }


        }

    })
    // thisThree.meshes['earth'].rotationStep.x = -coordY / 1000000;
    // thisThree.meshes['earth'].rotationStep.y = -coordX / 1000000;
};

basic.addEventListener({
    type: 'mousemove',
    listener: mouseListener,
})

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


