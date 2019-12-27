import * as THREE from 'three';

import { EffectComposer } from './postprocessing/EffectComposer';
import { FilmPass } from './postprocessing/FilmPass';
import { RenderPass } from './postprocessing/RenderPass';


// TODO: function to accept and run event listeners
export default class ThreeSceneBuilder {
    constructor(props) {
        this.renderer;
        this.scene;
        this.camera;
        this.light;
        this.meshArray = [];
        this.rotationStep = {
            x: 0,
            y: 0.0001,
        };
        this.composer;
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        return this;
    }

    initScene({
        background = new THREE.Color('#888'),
    } = {}) {
        this.scene = new THREE.Scene();
        this.scene.background = background;
        return this;
    }

    initCamera({
        positionZ = 0,
        positionY = 0,
        positionX = 0,
        cameraType = 'Perspective',
        cameraProps = [60, window.innerWidth / window.innerHeight, 1, 1000],
    } = {}) {
        this.camera = new THREE[`${cameraType}Camera`](...cameraProps);
        this.camera.position.z = positionZ;
        this.camera.position.y = positionY;
        this.camera.rotation.x = positionX;
        return this;
    }

    initLight({
        lightType = 'Directional',
        lightProps = [0xFFFFFF, 1],
        position = [.1, 0, .1],
    } = {}) {
        this.light = new THREE[`${lightType}Light`](...lightProps);
        this.light.position.set(...position);
        if (!this.scene) {
            console.error('You have to .initScene() before .initLight()')
        }
        this.scene.add(this.light);
        return this;
    }

    createMesh({
        geometryType = 'Sphere',
        geometryProps = [50, 100, 50],
        materialType = 'Basic',
        materialProps = {
            color: 'lightblue',
            wireframe: true,
        },
        rotation = {},
        rotationStep = {},
    } = {}) {
        const geometry = new THREE[`${geometryType}BufferGeometry`](...geometryProps);
        const material = new THREE[`Mesh${materialType}Material`](materialProps);
        const mesh = new THREE.Mesh(geometry, material);
        this.meshArray.push({
            mesh,
            rotationStep,
        });

        Object.keys(rotation).map(axis => {
            mesh.rotation[axis] = rotation[axis];
        });

        if (!this.scene) {
            console.error('You have to .initScene() before .createMesh()')
        }

        this.scene.add(mesh);
        return this;
    }

    initMouseListener() {
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            const coordX = e.clientX - this.renderer.domElement.width / 2;
            const coordY = e.clientY - this.renderer.domElement.height / 2;
            this.rotationStep.x = -coordY / 1000000;
            this.rotationStep.y = -coordX / 1000000;
        });
        return this;
    }

    initComposer() {
        var renderModel = new RenderPass(this.scene, this.camera);

        var effectFilm = new FilmPass(1, 1, 2048, false);

        this.composer = new EffectComposer(this.renderer);

        this.composer.addPass(renderModel);
        this.composer.addPass(effectFilm);
        return this;
    }

    update() {
        this.meshArray.map(mesh => {
            Object.keys(mesh.rotationStep).map(axis => {
                mesh.mesh.rotation[axis] += mesh.rotationStep[axis]
            })
        });
        this.renderer.render(this.scene, this.camera)
        if (this.composer) {
            this.composer.render();
        }
        return this;
    }
}

