import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
    .initScene({
        background: new THREE.Color('#222')
    })
    .initCamera({
     camera: {
         type: 'Perspective',
         props: [
             60,
             window.innerWidth / window.innerHeight,
             1,
             3000
         ]
     },
     position: {
         y: 320,
         z: 1050,
     },
     rotation: {
         x: -.1,
         // y: Math.PI / 2,
     }
    })
    .initLight({
        light: {
            type: 'Directional',
            props: [0xFFFFFF, 4],
        },
        position: {
            y: 700,
            z: -350,
        },
        // rotation: {
        //     // x: Math.PI / 4,
        // },
    });

// console.log('gridB', gridB);

// gridB.light.lookAt(gridB.scene.position);

const division = 50;
const limit = 2000;
const grid = new THREE.GridHelper(limit * 4, division, "purple", "purple");

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

// gridB.scene.add(grid);

const clock = new THREE.Clock();
let time = 0;

//      .initLight()
//      .createMesh();

var loader = new GLTFLoader();

loader.load(car, function (gltf) {
    // console.log('gltf.scene', gltf.scene);
    gltf.scene.position.y = 120;
    gltf.scene.rotation.y = Math.PI;
    gltf.scene.position.z = 320;
    gridB.scene.add(gltf.scene);
    renderB();
    console.log('gltf.scene', gltf.scene);

    // const light = new THREE.AmbientLight(0xFFFFFF, 1);
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.z = -1000;
    // light.position.y = 1000;


    // gltf.scene.add(light);

}, undefined, function (error) {
    console.error( error );
});



const controls = new TrackballControls(gridB.camera, gridB.renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = [65, 83, 68];


var renderScene = new RenderPass( gridB.scene, gridB.camera );

var bloomPass = new UnrealBloomPass(
    new THREE.Vector2( window.innerWidth, window.innerHeight ),
        .8,
    1,
    .2
);
// bloomPass.threshold = .4;
// bloomPass.strength = 2.7;
// bloomPass.radius = .1;


// gridB.renderer.toneMappingExposure = Math.pow( 1, 4);

const composer = new EffectComposer( gridB.renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );


const size = 500;
const count = 20;
const cell = 50;

var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( - size, 0, 0 ) );
geometry.vertices.push(new THREE.Vector3( size, 0, 0 ) );

const linesMaterial = new THREE.LineBasicMaterial( { color: 0x787878, opacity: .2, linewidth: 2 } );

function addLine({ name, position, rotation }) {
    gridB.createLine({
        name: name,
        geometry,
        position,
        material: {
            type: 'Basic',
            props: {
                color: 'magenta',
                linewidth: 2
            },
        },
        rotation
    })
}

for ( var i = 0; i <= count; i++ ) {
    addLine({
        name: `linex-${i}`,
        position: {
            z: ( i * cell ) - size,
        },
    });
    addLine({
        name: `liney-${i}`,
        position: {
            x: ( i * cell ) - size,
        },
        rotation: {
            y: 90 * Math.PI / 180
        }
    });
}



function renderB() {
    requestAnimationFrame(renderB);
    // time += clock.getDelta();
    time += .3;
    grid.material.uniforms.time.value = time;

    Object.keys(gridB.lines).map(name => {
        if (name.includes('x')) {
            if (gridB.lines[name].line.position.z < size) {
                gridB.lines[name].line.position.z += 1
            } else {
                delete gridB.lines[name]
                const selectedObject = gridB.scene.getObjectByName(name);
                gridB.scene.remove(selectedObject);
                addLine({
                    name:  `linex-${Date.now()}`,
                    position: {
                        z: ( 0 * cell ) - size,
                    },
                });
            }
        }
    });

    // console.log('gridB.scene', gridB.scene);

    gridB.update();
    controls.update();
    composer.render();
}
