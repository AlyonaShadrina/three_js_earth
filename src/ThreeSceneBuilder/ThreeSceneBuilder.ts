// import { WebGLRenderer, Color, Scene, PerspectiveCamera } from 'three';
import * as THREE from 'three';

import { EffectComposer } from '../postprocessing/EffectComposer';
import { RenderPass } from '../postprocessing/RenderPass';
import { Camera, Light, initScene, Mesh } from "./types";


let i = 0;

type RotationStep = {
    x?: number,
    y?: number,
    z?: number,
}

type MeshProps = {
    mesh: THREE.Mesh,
    rotationStep?: RotationStep,
}

type MeshesObject = {
    [propName: string]: MeshProps;
}

export default class ThreeSceneBuilder {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    light: THREE.Light;
    meshes: MeshesObject = {};
    composer: any;


    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        return this;
    }

    initScene({
        background = new THREE.Color()
    }: initScene): this {
        this.scene = new THREE.Scene();
        this.scene.background = background;
        return this;
    }

    initCamera({
        cameraType = 'Perspective',
        cameraProps = [60, window.innerWidth / window.innerHeight, 1, 1000],
        rotation = [0, 0, 0],
        position = [0, 0, 20],
    }: Camera = {}) {
        this.camera = new THREE[`${cameraType}Camera`](...cameraProps);
        this.camera.position.set(...position);
        this.camera.rotation.set(...rotation);
        return this;
    }

    initLight({
        lightType = 'Directional',
        lightProps = [0xFFFFFF, 1],
        rotation = [0, 0, 0],
        position = [.1, 0, .1],
    }: Light = {}) {
        if (!this.scene) {
            console.error('You have to .initScene() before .Light()')
        }

        this.light = new THREE[`${lightType}Light`](...lightProps);
        this.light.position.set(...position);
        this.light.rotation.set(...rotation);

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
    }: Mesh = {}) {
        if (!this.scene) {
            console.error('You have to .initScene() before .createMesh()')
        }

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

        this.scene.add(mesh);
        i++;
        return this;
    }

    addEventListener({
        type = 'click',
        listener = (e: any, thisThree: any) => null,
    } = {}) {
        this.renderer.domElement.addEventListener(type, (e: any) => listener(e, this));
        return this;
    }

    addEffect(effect: any) {
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
        this.renderer.render(this.scene, this.camera);
        if (this.composer) {
            this.composer.render();
        }
        return this;
    }
}

