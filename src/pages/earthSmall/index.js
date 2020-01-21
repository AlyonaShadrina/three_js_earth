import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import "../../style.css";
import "../../style-dark.css";
import "../../navigation";

// import earth from '../../assets/BlackMarble_2016_3km.jpg';
import earth from '../../assets/BlackMarble_2016_3km-min.jpg';
// import earth from '../../assets/Composite_map_of_the_world_2012.jpg';
// import nx from '../../assets/dark-s_nx.jpg';
// import ny from '../../assets/dark-s_ny.jpg';
//import nz from '../../assets/dark-s_nz.jpg';
import px from '../../assets/dark-s_px.jpg';
// import py from '../../assets/dark-s_py.jpg';
// import pz from '../../assets/dark-s_pz.jpg';
import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';


const loader = new THREE.TextureLoader();

const mouseListener = (e, thisThree) => {
    const coordX = e.clientX - thisThree.renderer.domElement.width / 2;
    const coordY = e.clientY - thisThree.renderer.domElement.height / 2;
    // thisThree.meshes['earth'].rotationStep.x = -coordY / 1000000;
    // thisThree.meshes['earth'].rotationStep.y = -coordX / 1000000;
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
    .initLight()
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
    .addEventListener({
        type: 'mousemove',
        listener: mouseListener,
    })
    // .addEffect(effectFilm);

var geometry = new THREE.PlaneBufferGeometry( 200, 200, 32 );
var material = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    map: loader.load(px),
} );
var plane = new THREE.Mesh( geometry, material );
earthPlanet.scene.add( plane );
plane.position.z = -100;
plane.position.y = 100;
// console.log('earthPlanet', earthPlanet);
// const controls = new TrackballControls(earthPlanet.camera, earthPlanet.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];


render();

function render() {
    requestAnimationFrame(render);
    earthPlanet.update();
    // controls.update();
}