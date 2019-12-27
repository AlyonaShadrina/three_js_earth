import * as THREE from 'three';
import { EffectComposer } from './postprocessing/EffectComposer';
import { FilmPass } from './postprocessing/FilmPass';
import { RenderPass } from './postprocessing/RenderPass';

import earth from './assets/BlackMarble_2016_3km.jpg';

// --- BASE

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
//
// const scene = new THREE.Scene();
// // scene.background = new THREE.Color(0xAAAAAA);
//
// const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
// camera.position.z = 45;
// camera.position.y = 35;
// // camera.position.x = -20;
// // camera.rotation.y = 180 * Math.PI / 180
// camera.rotation.x = 30 * Math.PI / 180
//
// const color = 0xFFFFFF;
// const intensity = 1;
// const light = new THREE.DirectionalLight(color, intensity);
// light.position.set(.1, 0, .1);
// scene.add(light);
//
//
//
// const loader = new THREE.TextureLoader();
//
//
// // var controls = new FlyControls( camera, renderer.domElement );
//
// // ---ELEMENTS
//
//
// var radius = 50;
// const widthSegments = 100;
// const heightSegments = 50;
// const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
// const material = new THREE.MeshBasicMaterial({
//     color: 'lightblue',
//     map: loader.load(earth),
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);
//
// scene.background = new THREE.CubeTextureLoader()
//     .setPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/' )
//     .load( [ 'dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg' ] );
//
//
// // --- RENDER
//
// // postprocessing
//
//
// var renderModel = new RenderPass( scene, camera );
//
// // console.log('RenderPass', renderModel);
//
// var effectFilm = new FilmPass( 0.35, 0.75, 2048, false );
//
// const composer = new EffectComposer( renderer );
//
// composer.addPass( renderModel );
// composer.addPass( effectFilm );
// var clock = new THREE.Clock();
//
//
//
//
// // var controls = new TrackballControls(camera, renderer.domElement);
//
// mesh.rotation.y = -120 * Math.PI / 180;
//
//

//
// function render() {
//     var delta = clock.getDelta();
//     requestAnimationFrame(render);
//     mesh.rotation.y += 0.0001;
//     renderer.render(scene, camera);
//     composer.render();
//
//     // controls.update()
//
//     // const dPlanet = camera.position.length();
//     // const d = ( dPlanet - radius * 1.01 );
//     // controls.movementSpeed = 0.33 * d;
//     // controls.update( delta );
//
//     // composer.render( delta );
// }
//
// render();


class Universe {
    constructor(props) {
        this.renderer;
        this.scene;
        this.camera;
        this.light;
        this.mesh;
        this.rotationStep = {
            x: 0.0001,
            y: 0,
        };
        this.loader = new THREE.TextureLoader();
        this.composer;
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 45;
        this.camera.position.y = 35;
        this.camera.rotation.x = 30 * Math.PI / 180
    }
    initLight() {
        const color = 0xFFFFFF;
        const intensity = 1;
        this.light = new THREE.DirectionalLight(color, intensity);
        this.light.position.set(.1, 0, .1);
        this.scene.add(this.light);
    }
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/' )
            .load( [ 'dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg' ] );
    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }
    initMouseListener() {
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            const coordX = e.clientX - this.renderer.domElement.width / 2;
            const coordY = e.clientY - this.renderer.domElement.height / 2;
            this.rotationStep.x = - coordY / 1000000;
            this.rotationStep.y = - coordX / 1000000;
        });
    }
    initComposer() {
        var renderModel = new RenderPass( this.scene, this.camera );

        var effectFilm = new FilmPass( 1, 1, 2048, false );

        this.composer = new EffectComposer( this.renderer );

        this.composer.addPass( renderModel );
        this.composer.addPass( effectFilm );
    }
    init() {
        this.initRenderer();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initMouseListener();
        this.createEarth();
        this.initComposer();
    }

    createEarth() {
        var radius = 50;
        const widthSegments = 100;
        const heightSegments = 50;
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({
            color: 'lightblue',
            map: this.loader.load(earth),
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.y = -120 * Math.PI / 180;
        this.scene.add(this.mesh);
    }

    update() {
        this.mesh.rotation.y += this.rotationStep.y;
        this.mesh.rotation.x += this.rotationStep.x;
        this.renderer.render(all.scene, all.camera)
        this.composer.render();
    }
}

const all = new Universe();
all.init();

render();

function render() {
    // var delta = clock.getDelta();
    requestAnimationFrame(render);
    all.update();
    // composer.render();

    // controls.update()

    // const dPlanet = camera.position.length();
    // const d = ( dPlanet - radius * 1.01 );
    // controls.movementSpeed = 0.33 * d;
    // controls.update( delta );

    // composer.render( delta );
}