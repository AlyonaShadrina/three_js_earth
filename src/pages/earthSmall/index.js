import {
    Vector2,
    TextureLoader,
    Color,
    Geometry,
    Vector3,
    Math as ThreeMath,
    PointsMaterial,
    Points,
    SphereBufferGeometry,
    MeshLambertMaterial,
} from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import Stats from 'three/examples/jsm/libs/stats.module';

import "../../style.css";
import "../../style-dark.css";
import "../../navigation";

import earth from '../../assets/BlackMarble_2016_3km-min.jpg';
import circle from '../../assets/circle.png';
import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';


const loader = new TextureLoader();
const bloomPass = new UnrealBloomPass(new Vector2( window.innerWidth, window.innerHeight ), 1, .3, .2);

const earthPlanet = new ThreeSceneBuilder()
    .initRenderer({
        stats: process.env.NODE_ENV === "development",
        props: { antialias: true },
    })
    .initScene({
        background: new Color('#030610'),
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
    .createLight({
        position: {
            x: .1,
            z: 400,
        },
        light: {
            type: 'Directional',
            props: [0xffffff, 1.5],
        },
    })
    .createLight({
        position: {
            y: 50,
            z: -55,
        },
        light: {
            type: 'Directional',
            props: [0x29264c, 50],
        },
    })
    .addEventListener({
        type: 'mousemove',
        listener: mouseListener,
    })
    .addEffect(bloomPass);

// psychodel
// const Afterimage = new AfterimagePass();
// earthPlanet.addEffect(Afterimage);
//
// const controls = new TrackballControls(earthPlanet.camera, earthPlanet.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

// add a stars to the background of a scene after star circle loads
loader.load(circle, addStars);
// add a earth mesh to scene after map loads
loader.load(earth, addEarth);

// for earth mesh rotation on mousemove
const rotationStep = {
    x: 0,
    y: 0.0001,
};

// some optimizations: stop animation when it is not in view
let animationFrameId;

const stats = new Stats;

render();

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener("focus", render, false);
window.addEventListener("blur", stopRender, false);
window.addEventListener("scroll", scroll, false);

// console.log('earthPlanet', earthPlanet);

function render() {
    animationFrameId = requestAnimationFrame(render);
    earthPlanet.update(updateCallback);
    // controls.update();
}

function updateCallback(builder) {
    const earth = builder.scene.getObjectByName('earth');
    // rotate camera to proper position after earth mesh loaded
    if (earth && builder.camera.rotation.x > 32 * Math.PI / 180 ) {
        builder.camera.rotation.x -= .05 * Math.PI / 180
    }
    // rotate earth mesh
    if (earth) {
        earth.rotation.y += rotationStep.y;
        earth.rotation.x += rotationStep.x;
    }
}

function mouseListener (e, thisThree) {
    const coordX = e.clientX - thisThree.renderer.domElement.width / 2;
    const coordY = e.clientY - thisThree.renderer.domElement.height / 2;
    rotationStep.x = -coordY / 1000000;
    rotationStep.y = -coordX / 1000000;
}


function addEarth(texture) {
    earthPlanet.createElement({
        geometry: new SphereBufferGeometry(50, 100, 50),
        material: new MeshLambertMaterial({ map: texture }),
        rotation: {
            y: -120 * Math.PI / 180
        },
        name: 'earth',
    });
}

function addStars(texture) {
    const starsGeometry = new Geometry();

    for (let i = 0; i < 10000; i ++ ) {
        const star = new Vector3();
        star.x = ThreeMath.randFloatSpread(1000);
        star.y = ThreeMath.randFloatSpread(1000);
        star.z = ThreeMath.randFloatSpread(100);
        starsGeometry.vertices.push(star);
    }

    earthPlanet.createElement({
        geometry: starsGeometry,
        material: new PointsMaterial({
            color: 0xffffff,
            map: texture,
        }),
        element: Points,
        position: {
            z: -100,
        }
    });
}

function stopRender() {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
}

function scroll() {
    if (window.scrollY > window.innerHeight) {
        if (animationFrameId) {
            stopRender();
        }
    } else {
        if (!animationFrameId) {
            render();
        }
    }
}

function onWindowResize() {
    earthPlanet.camera.aspect = window.innerWidth / window.innerHeight;
    earthPlanet.camera.updateProjectionMatrix();
    earthPlanet.renderer.setSize( window.innerWidth, window.innerHeight );
}