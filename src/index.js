import { TextureLoader, CubeTextureLoader } from 'three';

import earth from './assets/BlackMarble_2016_3km.jpg';
import nx from './assets/dark-s_nx.jpg';
import ny from './assets/dark-s_ny.jpg';
import nz from './assets/dark-s_nz.jpg';
import px from './assets/dark-s_px.jpg';
import py from './assets/dark-s_py.jpg';
import pz from './assets/dark-s_pz.jpg';
import { FilmPass } from './postprocessing/FilmPass';
import ThreeSceneBuilder from './ThreeSceneBuilder/ThreeSceneBuilder';


const loader = new TextureLoader();

const mouseListener = (e, thisThree) => {
    const coordX = e.clientX - thisThree.renderer.domElement.width / 2;
    const coordY = e.clientY - thisThree.renderer.domElement.height / 2;
    thisThree.meshes['earth'].rotationStep.x = -coordY / 1000000;
    thisThree.meshes['earth'].rotationStep.y = -coordX / 1000000;
};

const effectFilm = new FilmPass(1, 1, 2048, false);

const earthPlanet = new ThreeSceneBuilder()
    .initRenderer()
    .initScene({
        background: new CubeTextureLoader().load( [px, nx, py, ny, pz , nz] ),
    })
    .initCamera({
        position: {
            y: 35,
            z: 45,
        },
        rotation: {
            x: 30 * Math.PI / 180,
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
    .addEffect(effectFilm);

render();

function render() {
    requestAnimationFrame(render);
    earthPlanet.update();
}