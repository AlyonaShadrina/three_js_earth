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
addCircles(basic, 12, radius);

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

    const moveCoef = .05;

    const { domElement } = thisThree.renderer;

    const coordX = e.clientX - domElement.width / 2;
    const coordY = e.clientY - domElement.height / 2;
    const meshes = thisThree.meshes;

    Object.keys(meshes).map(meshName => {

        const { mesh } = meshes[meshName];
        if (mesh.position && meshName != 'ring') {
            var curx = mesh.position.x, cury = mesh.position.y;
            var speed = 10000; //follow speed of word, higher number is slower

            let mposx = coordX;
            let mposy = -coordY;
            let vec = {
                x: (mposx-curx),
                y: (mposy-cury),
            };

            if ((mesh.position.x + (vec.x * 1/speed)) ** 2 + (mesh.position.y + (vec.y * 1/speed)) ** 2 <= radius ** 2) {
                mesh.position.x += (vec.x * 1/speed);
                mesh.position.y += (vec.y * 1/speed);
            }
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


function radToDeg(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}