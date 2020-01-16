import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import "../../style.css";
import "../../navigation";
import car from '../../assets/tesla_cybertruck/out.glb';



// car by https://sketchfab.com/3d-models/tesla-cybertruck-ee93bd3b43344a34bee3ae0f2edf53ce
// converted to glb with http://glb-packer.glitch.me/

const gridB = new ThreeSceneBuilder();

gridB.initRenderer({
        props: {antialias: true}
    })
    .initScene()
    .initCamera({
     camera: {
         type: 'Perspective',
         props: [
             60,
             window.innerWidth / window.innerHeight,
             1,
             1000
         ]
     },
     position: {
         y: 10,
         z: 650,
     }
    })
    .initLight();

console.log('gridB', gridB);

gridB.camera.lookAt(gridB.scene.position);

const division = 600;
const limit = 4000;
const grid = new THREE.GridHelper(limit * 2, division, "blue", "blue");

const moveable = [];
for (let i = 0; i <= division; i++) {
    moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
}
grid.geometry.addAttribute(
    "moveable",
    new THREE.BufferAttribute(new Uint8Array(moveable), 1)
);

grid.material = new THREE.ShaderMaterial({
    uniforms: {
        time: {
            value: 0
        },
        limits: {
            value: new THREE.Vector2(-limit, limit)
        },
        speed: {
            value: 5
        }
    },
    vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    varying vec3 vColor;

    void main() {
      vColor = color;
      float limLen = limits.y - limits.x;
      vec3 pos = position;
      if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1
        float dist = speed * time;
        float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
        pos.z = currPos;
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
    fragmentShader: `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.);
    }
  `,
    vertexColors: THREE.VertexColors,
});

gridB.scene.add(grid);

const clock = new THREE.Clock();
let time = 0;

//      .initLight()
//      .createMesh();

var loader = new GLTFLoader();

loader.load( car, function ( gltf ) {

    gridB.scene.add( gltf.scene );

}, undefined, function ( error ) {

    console.error( error );

} );


renderB();

function renderB() {
    requestAnimationFrame(renderB);
    time += clock.getDelta();
    grid.material.uniforms.time.value = time;
    gridB.update();
}
