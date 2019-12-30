import * as THREE from 'three';

import { EffectComposer } from './postprocessing/EffectComposer';
import { RenderPass } from './postprocessing/RenderPass';


let i = 0;

export default class ThreeSceneBuilder {
    constructor(props) {
        this.renderer;
        this.scene;
        this.camera;
        this.light;
        this.meshes = {};
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
        positionZ = 20,
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
        geometryProps = [5, 10, 10],
        materialType = 'Basic',
        materialProps = {
            color: 'lightblue',
            wireframe: true,
        },
        rotation = {},
        rotationStep = {},
        name = i,
    } = {}) {
        const geometry = new THREE[`${geometryType}BufferGeometry`](...geometryProps);
        const material = new THREE[`Mesh${materialType}Material`](materialProps);
        const mesh = new THREE.Mesh(geometry, material);
        this.meshes[name] = {
            mesh,
            rotationStep,
        };

        Object.keys(rotation).map(axis => {
            mesh.rotation[axis] = rotation[axis];
        });

        if (!this.scene) {
            console.error('You have to .initScene() before .createMesh()')
        }

        this.scene.add(mesh);
        i++;
        return this;
    }

    addEventListener({
        type = 'click',
        listener = () => null,
    } = {}) {
        this.renderer.domElement.addEventListener(type, (e) => listener(e, this));
        return this;
    }

    addEffect(effect) {
        if (!this.composer) {
            const renderModel = new RenderPass(this.scene, this.camera);
            this.composer = new EffectComposer(this.renderer);
            this.composer.addPass(renderModel);
        }

        this.composer.addPass(effect);
        return this;
    }

    update() {
        Object.keys(this.meshes).map(meshName => {
            const mesh = this.meshes[meshName];
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

