import * as THREE from 'three';

import { EffectComposer } from '../postprocessing/EffectComposer';
import { RenderPass } from '../postprocessing/RenderPass';
import { Camera, EventListener, Light, Mesh, MeshesObject, Scene } from "./types";


let i = 0;

export default class ThreeSceneBuilder {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    light: THREE.Light;
    meshes: MeshesObject = {};
    composer: any;


    initRenderer({
        props = {}
    } = {}) {
        this.renderer = new THREE.WebGLRenderer(props);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        return this;
    }

    initScene({
        background = new THREE.Color()
    }: Scene = {}): this {
        this.scene = new THREE.Scene();
        this.scene.background = background;
        return this;
    }

    initCamera({
        camera = {
            type: 'Perspective',
            props: [60, window.innerWidth / window.innerHeight, 1, 1000],
        },
        rotation = {},
        position = {
            x: 0,
            y: 0,
            z: 20,
        },
    }: Camera = {}) {
        this.camera = new THREE[`${camera.type}Camera`](...camera.props);

        Object.keys(position).map(axis => {
            this.camera.position[axis] = position[axis];
        });

        Object.keys(rotation).map(axis => {
            this.camera.rotation[axis] = rotation[axis];
        });

        return this;
    }

    initLight({
        light = {
            type: 'Directional',
            props: [0xFFFFFF, 1],
        },
        rotation = {},
        position = {
            x: .1,
            y: 0,
            z: .1,
        },
    }: Light = {}) {
        if (!this.scene) {
            console.error('You have to .Scene() before .Light()')
        }

        this.light = new THREE[`${light.type}Light`](...light.props);

        Object.keys(position).map(axis => {
            this.light.position[axis] = position[axis];
        });

        Object.keys(rotation).map(axis => {
            this.light.rotation[axis] = rotation[axis];
        });

        this.scene.add(this.light);
        return this;
    }

    createMesh({
        geometry = {
            type: 'Sphere',
            props: [5, 10, 10],
        },
        material = {
            type: 'Basic',
            props: {
               color: 'lightblue',
               wireframe: true,
            },
        },
        rotation = {},
        rotationStep = {},
        name = i,
    }: Mesh = {}) {
        if (!this.scene) {
            console.error('You have to .Scene() before .createMesh()')
        }

        const ThreeGeometry = new THREE[`${geometry.type}BufferGeometry`](...geometry.props);
        const ThreeMaterial = new THREE[`Mesh${material.type}Material`](material.props);
        const mesh = new THREE.Mesh(ThreeGeometry, ThreeMaterial);
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
        type,
        listener,
    }: EventListener) {
        this.renderer.domElement.addEventListener(type, (e) => listener(e, this));
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

