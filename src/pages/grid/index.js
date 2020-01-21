import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import "../../navigation";
import "../../style.css";

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCar } from './car';
import { addLine, createGrid } from './grid';

// car by https://sketchfab.com/3d-models/tesla-cybertruck-ee93bd3b43344a34bee3ae0f2edf53ce
// converted to glb with http://glb-packer.glitch.me/

const gridB = new ThreeSceneBuilder();

gridB
    .initRenderer({
        props: {antialias: true}
    })
    .initScene({
        background: new THREE.Color('#222')
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
    .initLight({
        light: {
            type: 'Directional',
            props: [0xFFFFFF, 4],
        },
        position: {
            y: 700,
            z: -350,
        },
    });



addCar({ builder: gridB, onload: renderB });


const controls = new TrackballControls(gridB.camera, gridB.renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = [65, 83, 68];


var renderScene = new RenderPass( gridB.scene, gridB.camera );

var bloomPass = new UnrealBloomPass(
    new THREE.Vector2( window.innerWidth, window.innerHeight ),
        .8,
    1,
    .2
);

const composer = new EffectComposer( gridB.renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );


const size = 500;
const count = 20;
const cell = 50;

createGrid({ builder: gridB, cell, count, size });



function renderB() {
    requestAnimationFrame(renderB);

    Object.keys(gridB.lines).map(name => {
        if (name.includes('x')) {
            if (gridB.lines[name].line.position.z < size) {
                gridB.lines[name].line.position.z += 1
            } else {
                delete gridB.lines[name]
                const selectedObject = gridB.scene.getObjectByName(name);
                gridB.scene.remove(selectedObject);
                addLine({
                    builder: gridB,
                    name:  `linex-${Date.now()}`,
                    position: {
                        z: ( 0 * cell ) - size,
                    },
                    size,
                });
            }
        }
    });

    // console.log('gridB.scene', gridB.scene);

    gridB.update();
    controls.update();
    composer.render();
}
