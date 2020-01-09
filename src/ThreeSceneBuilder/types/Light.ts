import { Color } from "three";


export type DirectionalLight = {
    type: 'Directional',
    props: [Color | string | number, number],
}
export type AmbientLight = {
    type: 'Ambient',
    props: any[],
}
export type HemisphereLight = {
    type: 'Hemisphere',
    props: any[],
}
export type PointLight = {
    type: 'Point',
    props: any[],
}
export type SpotLight = {
    type: 'Spot',
    props: any[],
}
export type RectAreaLight = {
    type: 'RectArea',
    props: any[],
}