import { Vector2, Color } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import "../../navigation";
import "../../style-dark.css";
import "../../style.css";
import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCar } from './car';
import { addLine, createGrid } from './grid';

// car by https://sketchfab.com/3d-models/tesla-cybertruck-ee93bd3b43344a34bee3ae0f2edf53ce
// converted to glb with http://glb-packer.glitch.me/

const grid = new ThreeSceneBuilder();
const bloomPass = new UnrealBloomPass(new Vector2( window.innerWidth, window.innerHeight ), .8, 1, .2);

grid.initRenderer({
        props: { antialias: true }
    })
    .initScene({
        background: new Color('#222')
    })
    .initCamera({
     camera: {
         type: 'Perspective',
         props: [
             60,
             window.innerWidth / window.innerHeight,
             1,
             3000
         ]
     },
     position: {
         y: 320,
         z: 1050,
     },
     rotation: {
         x: -.1,
     }
    })
    .createLight({
        light: {
            type: 'Directional',
            props: [0xFFFFFF, 4],
        },
        position: {
            y: 700,
            z: -350,
        },
    })
    .addEffect(bloomPass);

const size = 900;
const count = 20;
const cell = 90;

createGrid({ builder: grid, cell, count, size });
addCar({ builder: grid, onload: renderB });

const controls = new TrackballControls(grid.camera, grid.renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = [65, 83, 68];

function renderB() {
    requestAnimationFrame(renderB);

    grid.scene.children.map(el => {
        const { name } = el;
        if (name.includes('x')) {
            if (el.position.z < size) {
                el.position.z += 1
            } else {
                const selectedObject = grid.scene.getObjectByName(name);
                grid.scene.remove(selectedObject);
                addLine({
                    builder: grid,
                    name:  `linex-${Date.now()}`,
                    position: {
                        z: -size,
                    },
                    size,
                });
            }
        }
    });

    grid.update();
    controls.update();
}
