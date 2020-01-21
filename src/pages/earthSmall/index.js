import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import "../../style.css";
import "../../style-dark.css";
import "../../navigation";

import earth from '../../assets/BlackMarble_2016_3km-min.jpg';
import px from '../../assets/dark-s_px.jpg';
import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';


const loader = new THREE.TextureLoader();

const mouseListener = (e, thisThree) => {
    const coordX = e.clientX - thisThree.renderer.domElement.width / 2;
    const coordY = e.clientY - thisThree.renderer.domElement.height / 2;
    thisThree.meshes['earth'].rotationStep.x = -coordY / 1000000;
    thisThree.meshes['earth'].rotationStep.y = -coordX / 1000000;
};

const effectFilm = new FilmPass(1, 1, 2048, false);

const earthPlanet = new ThreeSceneBuilder()
    .initRenderer()
    .initScene()
    .initCamera({
        camera: {
            type: 'Perspective',
            props: [30, window.innerWidth / window.innerHeight, 1, 1000],
        },
        position: {
            y: 30,
            z: 50,
        },
        rotation: {
            x: 32 * Math.PI / 180,
        }
    })
    .initLight({
        position: {
            x: .1,
            y: 0,
            z: 400,
        },
        light: {
            type: 'Directional',
            props: [0xffffff, 2.5],
        }
    })
    .createMesh({
        geometry: {
            type: 'Sphere',
            props: [50, 100, 50],
        },
        material: {
            type: 'Basic',
            props: { map: loader.load(earth) },
        },
        rotation: {
            y: -120 * Math.PI / 180
        },
        rotationStep: {
            y: 0.0001,
        },
        name: 'earth',
    })
    .createMesh({
        geometry: {
            type: 'Plane',
            props: [200, 200, 4],
        },
        material: {
            type: 'Basic',
            props: {
                color: 0xffffff,
                map: loader.load(px),
            }
        },
        position: {
            z: -100,
            y: 100,
        },
        name: 'plane'
    })
    .addEventListener({
        type: 'mousemove',
        listener: mouseListener,
    })
    // .addEffect(effectFilm);

// psychodel
// const Afterimage = new AfterimagePass();
// earthPlanet.addEffect(Afterimage);


render();

function render() {
    requestAnimationFrame(render);
    earthPlanet.update();
    // controls.update();
}