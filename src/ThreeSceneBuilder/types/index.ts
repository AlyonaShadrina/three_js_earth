import * as THREE from "three";

type Object3D = {
    position?: {
        x?: number,
        y?: number,
        z?: number,
    },
    rotationStep?: {
        x?: number,
        y?: number,
        z?: number,
    },
    rotation?: {
        x?: number,
        y?: number,
        z?: number,
    }
}

export type Scene = {
    background?: THREE.Color | THREE.Texture,
}

// TODO: some conditional props (depending on type)
export type Camera = Object3D & {
    cameraType?: 'Perspective' | 'Orthographic' | 'Cube' | 'Stereo',
    cameraProps?: [number, number, number, number] | [number, number, number, number, number, number] | [number, number, number, Object],
}
export type Light = Object3D & {
    lightType?: 'Directional' | 'Ambient' | 'Hemisphere' | 'Point' | 'Spot' | 'RectArea',
    lightProps?: [number, number] | [] | [] | [] | [] | [],
}

export type Mesh = Object3D & {
    geometryType?: 'Sphere' | 'Box' | 'Circle' | 'Cone' | 'Cylinder' | 'Dodecahedron' | 'Extrude' | 'Icosahedron' | 'Lathe' | 'Octahedron' | 'Parametric' | 'Plane' | 'Ring' | 'Tetrahedron' | 'Torus',
    geometryProps?: [number, number, number],
    materialType?: 'Basic' | 'Phong',
    materialProps?: THREE.MeshBasicMaterialParameters | THREE.MeshPhongMaterialParameters,
    name?: string | number,
}