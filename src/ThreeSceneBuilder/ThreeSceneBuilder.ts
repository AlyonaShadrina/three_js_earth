import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { Camera, EventListener, Light, Scene } from "./types";


let i = 0;

export default class ThreeSceneBuilder {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    light: THREE.Light;
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

        this.addPositionAndRotation(this.camera, position, rotation);

        return this;
    }

    createLight({
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

        this.addPositionAndRotation(this.light, position, rotation);

        this.scene.add(this.light);
        return this;
    }

    createElement({
        geometry = new THREE.SphereBufferGeometry(5, 10, 10),
        material = new THREE.MeshBasicMaterial({ color: 'lightblue', wireframe: true, }),
        element = THREE.Mesh,
        rotation = {},
        // rotationStep = {},
        name = i,
        position = {},
    } = {}) {
        if (!this.scene) {
            console.error('You have to .Scene() before .createElement()')
        }
        // if (element) {
            const object = new element(geometry, material);
            this.addPositionAndRotation(object, position, rotation);
            object.name = name.toString();

            // this.elements[name] = object;

            this.scene.add(object);
            i++;
        // }

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

    update(callback) {
        this.renderer.render(this.scene, this.camera);
        if (this.composer) {
            this.composer.render();
        }
        if (callback) {
            callback(this);
        }
        return this;
    }

    // helpers

    private addPositionAndRotation(obj, position, rotation) {
        Object.keys(position).map(axis => {
            obj.position[axis] = position[axis];
        });

        Object.keys(rotation).map(axis => {
            obj.rotation[axis] = rotation[axis];
        });
    }
}

