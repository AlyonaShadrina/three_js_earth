import * as THREE from 'three';

import earth from './assets/BlackMarble_2016_3km.jpg';
import nx from './assets/dark-s_nx.jpg';
import ny from './assets/dark-s_ny.jpg';
import nz from './assets/dark-s_nz.jpg';
import px from './assets/dark-s_px.jpg';
import py from './assets/dark-s_py.jpg';
import pz from './assets/dark-s_pz.jpg';
import ThreeSceneBuilder from './ThreeSceneBuilder';


const loader = new THREE.TextureLoader();

const all = new ThreeSceneBuilder()
    .initRenderer()
    .initScene({
        background: new THREE.CubeTextureLoader().load( [ px, nx, py, ny, pz , nz, ] ),
    })
    .initCamera({
        positionZ: 45,
        positionY: 35,
        positionX: 30 * Math.PI / 180,
    })
    .initLight()
    .createMesh({
        materialProps: { map: loader.load(earth) },
        rotation: { y: -120 * Math.PI / 180 },
        rotationStep: {
            y: 0.0001,
        }
    })
    // .initMouseListener()
    // .initComposer();

render();

function render() {
    requestAnimationFrame(render);
    all.update();
}