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
addCircles(basic, 8, radius);

const direction = {
    x: null,
    y: null,
};
let oldCoords = {
    x: null,
    y: null,
}

const mouseListener = (e, thisThree) => {

    if (e.pageX < oldCoords.x) {
        direction.x = "left"
    } else if (e.pageX > oldCoords.x) {
        direction.x = "right"
    }

    if (e.pageY < oldCoords.y) {
        direction.y = "top"
    } else if (e.pageY > oldCoords.y) {
        direction.y = "bottom"
    }

    oldCoords = {
        x: e.pageX,
        y: e.pageY
    };

    const moveCoef = 0.05;

    const { domElement } = thisThree.renderer;

    const coordX = e.clientX - domElement.width / 2;
    const coordY = e.clientY - domElement.height / 2;
    const meshes = thisThree.meshes;

    Object.keys(meshes).map(meshName => {

        const { mesh } = meshes[meshName];
        if (mesh.position && meshName != 'ring') {
            const circleRadius = mesh.geometry.parameters.radius;

            const moveFormula = (1 / circleRadius) * moveCoef;

            // console.log('mesh.position.x', mesh.position.x);
            // console.log('Math.cos(45 * (Math.PI / 180))', Math.cos(45 * (Math.PI / 180)));
            // console.log('**', mesh.position.x * Math.cos(45 * (Math.PI / 180)));
            // console.log('----');

            const top = (mesh.position.x ** 2 + mesh.position.y ** 2 + radius ** 2);
            const bottom = ( 2 * mesh.position.x * mesh.position.y );

            // console.log('top', top);
            // console.log('bottom', bottom);

            const angle = Math.cos((top / bottom) * (Math.PI / 180));
            console.log('angle', angle);
            if (
                // ((mesh.position.x + moveFormula) + circleRadius <= radius * (mesh.position.y / circleRadius))
                ((mesh.position.x + moveFormula) * Math.cos(angle * (Math.PI / 180)) + circleRadius <= radius )
                && direction.x === 'right'
            ) {
                mesh.position.x += (moveFormula);
            }
            // else if ((mesh.position.x - moveFormula - circleRadius >= -radius)
            //     && direction.x === 'left'
            // ) {
            //     mesh.position.x -= moveFormula;
            // }
            //
            // if ((mesh.position.y + moveFormula + circleRadius <= radius)
            //     && direction.y === 'top'
            // ) {
            //     mesh.position.y += moveFormula;
            // } else if ((mesh.position.y - moveFormula - circleRadius >= -radius)
            //     && direction.y === 'bottom'
            // ) {
            //     mesh.position.y -= moveFormula;
            // }
        }

    })

};

basic.addEventListener({
    type: 'mousemove',
    listener: mouseListener,
})

// const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
    // controls.update();
}


