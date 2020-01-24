import { RingBufferGeometry, MeshBasicMaterial, Color } from 'three';
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
addCircles(basic, 12, radius);

basic.addEventListener({
    type: 'mousemove',
    listener: mouseListener,
})

// const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

let INTERSECTED;

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
            console.log('INTERSECTED', INTERSECTED.material.emissive);
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            console.log(intersects.length);
        }
    } else {
        if ( INTERSECTED && INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }

}

window.addEventListener( 'mousemove', onMouseMove, false );

function render() {

    raycaster.setFromCamera( mouse, basic.camera );

    // calculate objects intersecting the picking ray


    controls.update();

    var intersects = raycaster.intersectObjects( basic.scene.children );

    console.log('intersects', intersects);

    // for ( var i = 0; i < intersects.length; i++ ) {
    //
    //     intersects[ i ].object.material.color.set( 0xff0000 );
    //
    // }
    //
    // if ( intersects.length > 0 ) {
    //     if ( INTERSECTED != intersects[ 0 ].object ) {
    //         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    //         INTERSECTED = intersects[ 0 ].object;
    //         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
    //         INTERSECTED.material.emissive.setHex( 0xff0000 );
    //         console.log(intersects.length);
    //     }
    // } else {
    //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    //     INTERSECTED = null;
    // }

    requestAnimationFrame(render);

    basic.update();
    // controls.update();
}
