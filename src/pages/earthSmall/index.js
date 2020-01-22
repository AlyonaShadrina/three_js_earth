import { Vector2 } from 'three';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import "../../style.css";
import "../../style-dark.css";
import "../../navigation";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// import sky from '../../assets/VioletTornAmericantoad-size_restricted.gif';
// import sky from '../../assets/sky3890.jpg';
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
const bloomPass = new UnrealBloomPass(
    new Vector2( window.innerWidth, window.innerHeight ),
    1,
        .3,
    .2
);
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
    // .initLight({
    //     position: {
    //         x: .1,
    //         y: 400,
    //         // z: 400,
    //     },
    //     light: {
    //         type: 'Directional',
    //         props: [0xffffff, 2.5],
    //     },
    //     rotation: {
    //         z: 90 * Math.PI / 180,
    //     }
    // })
    // .initLight({
    //     position: {
    //         x: .1,
    //         y: 52,
    //         z: 25,
    //     },
    //     light: {
    //         type: 'Point',
    //         props: [0x29264c, 50, 20],
    //     },
    //     // rotation: {
    //     //     z: 90 * Math.PI / 180,
    //     // }
    // })
    .createMesh({
        geometry: {
            type: 'Sphere',
            props: [50, 100, 50],
        },
        material: {
            type: 'Basic',
            props: { map: loader.load(earth) },k
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
            props: [300, 300, 4],
        },
        material: {
            type: 'Basic',
            props: {
                color: 0xffffff,
                map: loader.load(px),
                // map: loader.load(sky),
            }
        },
        position: {
            z: -60,
            y: 100,
        },
        name: 'plane'
    })
    .addEventListener({
        type: 'mousemove',
        listener: mouseListener,
    })
    // .addEffect(effectFilm);
    .addEffect(bloomPass);

// psychodel
// const Afterimage = new AfterimagePass();
// earthPlanet.addEffect(Afterimage);

// earthPlanet.scene.fog=new THREE.Fog( 0xffffff, 0, 500 );
// const controls = new TrackballControls(earthPlanet.camera, earthPlanet.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

// some optimizations: stop animation when it is not in view
let animationFrameId;

const render = () => {
    animationFrameId = requestAnimationFrame(render);
    earthPlanet.update();
    // controls.update();

};

const stopRender = () => {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
};

const scroll = () => {
    if (window.scrollY > window.innerHeight) {
        if (animationFrameId) {
            stopRender();
        }
    } else {
        if (!animationFrameId) {
            console.log('render');
            render();
        }
    }
};

const onWindowResize = () => {
    earthPlanet.camera.aspect = window.innerWidth / window.innerHeight;
    earthPlanet.camera.updateProjectionMatrix();
    earthPlanet.renderer.setSize( window.innerWidth, window.innerHeight );
};

render();

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener("focus", render, false);
window.addEventListener("blur", stopRender, false);
window.addEventListener("scroll", scroll, false);