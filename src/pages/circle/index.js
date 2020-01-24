import { RingBufferGeometry, MeshBasicMaterial, Color } from 'three';
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import "../../navigation";
import "../../style.css";

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCircles } from './circles';
import { mouseListener } from './mouseListener';


const radius = 7;

const basic = new ThreeSceneBuilder();
basic.initRenderer()
    .initScene({
        background: new Color('#e1d1c2'),
    })
    .initCamera()
    .createLight()
    .createElement({
        geometry: new RingBufferGeometry(radius, radius + .5, radius * 15),
        material: new MeshBasicMaterial({  color: '#1c2124' }),
        name: 'ring'
    });

// addLines(basic, 10, radius);
addCircles(basic, 8, radius);

basic.addEventListener({
    type: 'mousemove',
    listener: mouseListener,
});

const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.keys = [65, 83, 68];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

let INTERSECTED;
let SELECTED;

render();

function onMouseMove( event ) {

    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // find intersections
    raycaster.setFromCamera( mouse, basic.camera );
    var intersects = raycaster.intersectObjects( basic.scene.children );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED && INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            // console.log(INTERSECTED.position);

            const coordX = mouse.x;
            const coordY = mouse.y;

            const vec = {
                x: (coordX - INTERSECTED.position.x),
                y: (-coordY - INTERSECTED.position.y),
            };




            const circleRadius = INTERSECTED.geometry.parameters.radius

            const speed = 5000 * circleRadius;

            const centerPositionRadius = (INTERSECTED.position.x + (vec.x * 1 / speed)) ** 2 + (INTERSECTED.position.y + (vec.y * 1 / speed)) ** 2;


            if (centerPositionRadius <= (radius - circleRadius) ** 2) {
                // INTERSECTED.position.x = coordX;
                // INTERSECTED.position.y = coordY;
            }

        }
    } else {
        if ( INTERSECTED && INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }

    if (SELECTED && intersects[0]) {
        const centerPositionRadius = intersects[0].point.x ** 2 + intersects[0].point.y ** 2;

        if (centerPositionRadius <= (radius - SELECTED.geometry.parameters.radius) ** 2) {
            SELECTED.position.copy(intersects[0].point);
        }
    }

}


basic.renderer.domElement.addEventListener( 'mousedown', function(event) {
    var intersects = raycaster.intersectObjects( basic.scene.children );
    if (intersects[0]) {
        SELECTED = intersects[0].object
    }
}, false );

basic.renderer.domElement.addEventListener( 'mouseup', function(event) {
    SELECTED = null
}, false );


basic.renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );

function render() {
    raycaster.setFromCamera( mouse, basic.camera );
    requestAnimationFrame(render);

    basic.update();
    // controls.update();
}
