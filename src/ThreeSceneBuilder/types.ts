import * as THREE from "three";

type Object3D = {
    rotation?: [number, number, number],
    position?: [number, number, number],
}

export type initScene = {
    background?: THREE.Color | THREE.Texture,
}

// TODO: some conditional props (depending on type)
export type Camera = Object3D & {
    rotation?: [number, number, number],
    position?: [number, number, number],
    cameraType?: 'Perspective' | 'Orthographic' | 'Cube' | 'Stereo',
    cameraProps?: [number, number, number, number] | [number, number, number, number, number, number] | [number, number, number, Object],
}
export type Light = Object3D & {
    rotation?: [number, number, number],
    position?: [number, number, number],
    lightType?: 'Directional' | 'Ambient' | 'Hemisphere' | 'Point' | 'Spot' | 'RectArea',
    lightProps?: [number, number] | [] | [] | [] | [] | [],
}

export type Mesh = {
    geometryType?: 'Sphere' | 'Box' | 'Circle' | 'Cone' | 'Cylinder' | 'Dodecahedron' | 'Extrude' | 'Icosahedron' | 'Lathe' | 'Octahedron' | 'Parametric' | 'Plane' | 'Ring' | 'Tetrahedron' | 'Torus',
    geometryProps?: [number, number, number],
    materialType?: 'Basic' | 'Phong',
    materialProps?: THREE.MeshBasicMaterialParameters | THREE.MeshPhongMaterialParameters,
    rotation?: {},
    rotationStep?: {},
    name?: string | number,
}