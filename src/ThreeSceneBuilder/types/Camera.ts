export type PerspectiveCamera = {
    type: 'Perspective',
    props: [number, number, number, number],
}
export type OrthographicCamera = {
    type: 'Orthographic',
    props: [number, number, number, number, number, number],
}
export type CubeCamera = {
    type: 'Cube',
    props: [number, number, number, Object],
}
export type StereoCamera = {
    type: 'Stereo',
    props: null,
}