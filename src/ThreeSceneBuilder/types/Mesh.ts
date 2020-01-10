// TODO: add more geometry and materials
//'Sphere' | 'Box' | 'Circle' | 'Cone' | 'Cylinder' | 'Dodecahedron' | 'Extrude' | 'Icosahedron' | 'Lathe' | 'Octahedron' | 'Parametric' | 'Plane' | 'Ring' | 'Tetrahedron' | 'Torus',
import * as THREE from "three";


// geometry
export type SphereGeometry = {
    type: 'Sphere',
    props: [number, number, number],
}
export type BoxGeometry = {
    type: 'Box',
    props: [number, number, number, number, number, number],
}
export type TorusGeometry = {
    type: 'Torus',
    props: [number, number, number, number],
}
export type RingGeometry = {
    type: 'Torus',
    props: [number, number, number],
}
export type CircleGeometry = {
    type: 'Circle',
    props: [number, number],
}

// material
export type BasicMaterial = {
    type: 'Basic',
    props: THREE.MeshBasicMaterialParameters,
}
export type PhongMaterial = {
    type: 'Phong',
    props: THREE.MeshPhongMaterialParameters,
}