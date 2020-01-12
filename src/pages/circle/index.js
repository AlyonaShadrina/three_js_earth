import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import "../../style.css";
import "../../navigation";


const basic = new ThreeSceneBuilder();
basic.initRenderer()
    .initScene()
    .initCamera()
    .initLight()
    .createMesh({
         geometry: {
             type: 'Ring',
             props: [7, 7, 30]
         }
    })


// const circles = [
//     {
//         geometry: [2.7, 20],
//         position: {
//             y: -.5,
//         }
//     },
//     {
//         geometry: [1.8, 20],
//         position: {
//             y: 3.3,
//             x: -2,
//         }
//     },
//     {
//         geometry: [2.2, 20],
//         position: {
//             y: .7,
//             x: 3.6,
//         }
//     },
// ];


function generateRandomCircles(count = 7) {
    const circlesArray = [];
    console.log(random(6, count));
    for (let i = 0; i < count; i++) {
        let radius = random(0, count / 2);
        circlesArray.push({
            geometry: [radius, 20],
            position: {
                y: random(-(count - radius), count - radius) * Math.cos(45 * (Math.PI/180)),
                x: random(-(count - radius), count - radius) * Math.cos(45 * (Math.PI/180)),
            }
        })
    }
    return circlesArray;
}

function random(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function addCircles(circles) {
    generateRandomCircles().map(cirlce => {
        basic.createMesh({
            geometry: {
                type: 'Circle',
                props: cirlce.geometry
            },
            material: {
                type: 'Basic',
                props: {
                    color: 'red',
                    wireframe: true,
                    ...cirlce.material
                }
            },
            position: cirlce.position
        })
    })
}

addCircles();
// addCircles(circles);

const controls = new TrackballControls( basic.camera, basic.renderer.domElement );

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.keys = [ 65, 83, 68 ];


const lines = [
    [
       [-3.6, -4.6, 0],
       [3.6, 4.6, 0],
    ],
    [
        [-4.6, -4, 0],
        [-1, -4.5, 0],
    ],
    [
        [-4.6, -4.5, 0],
        [-1, -4, 0],
    ],
];

function addLines(lines) {
    var material = new THREE.LineBasicMaterial( { color: 'grey' } );

    lines.map(line => {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(...line[0]));
        geometry.vertices.push(new THREE.Vector3(...line[1]));
        basic.scene.add(new THREE.Line( geometry, material ));
    })

}

// addLines(lines);

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
    controls.update();
}