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

function generateRandomCircles(count = 7) {
    const circlesArray = [];
    console.log(random(6, count));
    for (let i = 0; i < count; i++) {
        let radius = random(1, count / 2);
        let x = random(-(count - radius), count - radius);
        let y = random(-(count - radius), count - radius);
        let sin = x / radius;
        // sin2(α) + cos2(α) = 1
        // let сos = Math.sqrt(1 - sin ** 2);
        // console.log('radius', radius);
        // console.log('x', x);
        // console.log('y', y);
        // console.log('sin', sin);
        // console.log('сos', сos);
        circlesArray.push({
            geometry: [radius, radius * 15],
            position: {
                // y: y * сos,
                // x: x * сos,
                y: y * Math.cos(45 * (Math.PI/180)),
                x: x * Math.cos(45 * (Math.PI/180)),
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



function addLines() {
    var material = new THREE.LineBasicMaterial( { color: 'grey' } );

    const lines = generateRandomLines();
    console.log('lines', lines);
    lines.map(line => {
        const geometry = new THREE.Geometry();
        console.log('line', line);
        geometry.vertices.push(new THREE.Vector3(...line[0]));
        geometry.vertices.push(new THREE.Vector3(...line[1]));
        basic.scene.add(new THREE.Line( geometry, material ));
    })

}

function generateRandomLines(count = 9, max = 7) {
    const array = [];
    for (let i = 0; i < count; i++) {
        let radius = random(1, count / 2);
        let x1 = random(-(max - radius), max - radius);
        let y1 = random(-(max - radius), max - radius);
        let x2 = random(-(max - radius), max - radius);
        let y2 = random(-(max - radius), max - radius);


        const line = [
            [x1 * Math.cos(45 * (Math.PI/180)), y1 * Math.cos(45 * (Math.PI/180)), 1],
            [x2 * Math.cos(45 * (Math.PI/180)), y2 * Math.cos(45 * (Math.PI/180)), 1]
        ];
        array.push(line)
    }
    return array;
}


addLines();

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
    controls.update();
}