import { Vector2 } from 'three';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import "../../style.css";
import "../../style-dark.css";
import "../../navigation";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import earth from '../../assets/BlackMarble_2016_3km-min.jpg';
import circle from '../../assets/circle.png';
import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';


const loader = new THREE.TextureLoader();

const mouseListener = (e, thisThree) => {
    const coordX = e.clientX - thisThree.renderer.domElement.width / 2;
    const coordY = e.clientY - thisThree.renderer.domElement.height / 2;
    thisThree.meshes['earth'].rotationStep.x = -coordY / 1000000;
    thisThree.meshes['earth'].rotationStep.y = -coordX / 1000000;
};

const bloomPass = new UnrealBloomPass(
    new Vector2( window.innerWidth, window.innerHeight ),
    1,
        .3,
    .2
);
const earthPlanet = new ThreeSceneBuilder()
    .initRenderer()
    .initScene({
        background: new THREE.Color('#030610')
        // background: new THREE.Color('#0a0a15')
    })
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
            x: 42 * Math.PI / 180,
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
    //         props: [0xffffff, 1],
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
    .addEventListener({
        type: 'mousemove',
        listener: mouseListener,
    })
    .addEffect(bloomPass);

// psychodel
// const Afterimage = new AfterimagePass();
// earthPlanet.addEffect(Afterimage);

// const controls = new TrackballControls(earthPlanet.camera, earthPlanet.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

const addEarth = (texture) => {
    earthPlanet.createMesh({
        geometry: {
            type: 'Sphere',
            props: [50, 100, 50],
        },
        material: {
            type: 'Basic',
            props: { map: texture },
        },
        rotation: {
            y: -120 * Math.PI / 180
        },
        rotationStep: {
            y: 0.0001,
        },
        name: 'earth',
    });
};

const addStars = (texture) => {
    const starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i ++ ) {
        const star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(1000);
        star.y = THREE.Math.randFloatSpread(1000);
        star.z = THREE.Math.randFloatSpread(100);
        starsGeometry.vertices.push(star);
    }

    earthPlanet.createElement({
        geometry: starsGeometry,
        material: new THREE.PointsMaterial({
            color: 0xffffff,
            map: texture,
        }),
        element: THREE.Points,
        position: {
            z: -100,
        }
    });
};

// rotate camera to proper position after earth mesh loaded
const updateCallback = (builder) => {
    if (builder.meshes['earth'] && builder.camera.rotation.x > 32 * Math.PI / 180 ) {
        builder.camera.rotation.x -= .05 * Math.PI / 180
    }
};

// some optimizations: stop animation when it is not in view
let animationFrameId;

const render = () => {
    animationFrameId = requestAnimationFrame(render);
    earthPlanet.update(updateCallback);
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
            render();
        }
    }
};

const onWindowResize = () => {
    earthPlanet.camera.aspect = window.innerWidth / window.innerHeight;
    earthPlanet.camera.updateProjectionMatrix();
    earthPlanet.renderer.setSize( window.innerWidth, window.innerHeight );
};

// add a stars to the background of a scene after star circle loads
loader.load(circle, addStars);
// add a earth mesh to scene after map loads
loader.load(earth, addEarth);

render();

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener("focus", render, false);
window.addEventListener("blur", stopRender, false);
window.addEventListener("scroll", scroll, false);