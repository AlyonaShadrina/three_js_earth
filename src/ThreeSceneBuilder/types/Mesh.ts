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

// material
export type MeshBasicMaterial = {
    type: 'Basic',
    props: THREE.MeshBasicMaterialParameters,
}
export type MeshPhongMaterial = {
    type: 'Phong',
    props: THREE.MeshPhongMaterialParameters,
}
