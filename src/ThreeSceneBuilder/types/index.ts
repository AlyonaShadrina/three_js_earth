import * as THREE from "three";
import { CubeCamera, OrthographicCamera, PerspectiveCamera, StereoCamera } from "./Camera";
import { AmbientLight, DirectionalLight, HemisphereLight, PointLight, RectAreaLight, SpotLight } from "./Light";
import { BasicMaterial, BoxGeometry, PhongMaterial, SphereGeometry } from "./Mesh";


type Coordinates3D = {
    x?: number,
    y?: number,
    z?: number,
}

type Object3D = {
    position?: Coordinates3D,
    rotation?: Coordinates3D
    rotationStep?: Coordinates3D,
}

export type Scene = {
    background?: THREE.Color | THREE.Texture,
}

export type Camera = Object3D & {
    camera?: PerspectiveCamera | OrthographicCamera | CubeCamera | StereoCamera
}

export type Light = Object3D & {
    light?: DirectionalLight | AmbientLight | HemisphereLight | PointLight | SpotLight | RectAreaLight,
}

type Line = Object3D & { type: 'Line', props: any[]};

export type Mesh = Object3D & {
    geometry?: SphereGeometry | BoxGeometry | Line,
    material?: BasicMaterial | PhongMaterial,
    name?: string | number,
}

type MeshProps = {
    mesh: THREE.Mesh,
    rotationStep?: Coordinates3D,
}

export type MeshesObject = {
    [propName: string]: MeshProps;
}

export type EventListener = {
    type: string,
    listener(e: any, thisThree: any): void;
}