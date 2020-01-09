import * as THREE from "three";
import { CubeCamera, OrthographicCamera, PerspectiveCamera, StereoCamera } from "./Camera";
import { AmbientLight, DirectionalLight, HemisphereLight, PointLight, RectAreaLight, SpotLight } from "./Light";


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

export type Mesh = Object3D & {
    geometryType?: 'Sphere' | 'Box' | 'Circle' | 'Cone' | 'Cylinder' | 'Dodecahedron' | 'Extrude' | 'Icosahedron' | 'Lathe' | 'Octahedron' | 'Parametric' | 'Plane' | 'Ring' | 'Tetrahedron' | 'Torus',
    geometryProps?: [number, number, number],
    materialType?: 'Basic' | 'Phong',
    materialProps?: THREE.MeshBasicMaterialParameters | THREE.MeshPhongMaterialParameters,
    name?: string | number,
}