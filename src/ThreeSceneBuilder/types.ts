import * as THREE from "three";


export type initScene = {
    background?: typeof THREE.Color | THREE.Texture,
}

// TODO: some conditional props (depending on type)
export type initCamera = {
    positionZ?: number,
    positionY?: number,
    positionX?: number,
    cameraType?: 'Perspective' | 'Orthographic' | 'Cube' | 'Stereo',
    cameraProps?: [number, number, number, number],
}
export type initLight = {
    lightType?: 'Directional' | 'Ambient' | 'Hemisphere' | 'Point' | 'Spot' | 'RectArea',
    lightProps?: [number, number],
    position?: [number, number, number],
}