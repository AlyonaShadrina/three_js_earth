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

// const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

class MouseInteractions {
    constructor() {
        this.INTERSECTED = null;
        this.SELECTED = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    onMouseMove( event ) {

        // this.mouse = new THREE.Vector2();


        event.preventDefault();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // find intersections
        this.raycaster.setFromCamera( this.mouse, basic.camera );
        var intersects = this.raycaster.intersectObjects( basic.scene.children );
        if ( intersects.length > 0 ) {
            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                if ( this.INTERSECTED && this.INTERSECTED.material.emissive) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );
                // console.log(INTERSECTED.position);
            }
        } else {
            if ( this.INTERSECTED && this.INTERSECTED.material.emissive) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }

        if (this.SELECTED && intersects[0]) {
            const centerPositionRadius = intersects[0].point.x ** 2 + intersects[0].point.y ** 2;

            if (centerPositionRadius <= (radius - this.SELECTED.geometry.parameters.radius) ** 2) {
                this.SELECTED.position.copy(intersects[0].point);
            }
        }

    }

    onMouseDown() {

        var intersects = this.raycaster.intersectObjects( basic.scene.children );
        if (intersects[0]) {
            this.SELECTED = intersects[0].object
        }
    }

    onMouseUp() {
        this.SELECTED = null
    }

    addInteractions(builder) {
        builder.renderer.domElement.addEventListener( 'mousedown', (e) => this.onMouseDown(e), false );
        builder.renderer.domElement.addEventListener( 'mouseup', (e) => this.onMouseUp(e), false );
        builder.renderer.domElement.addEventListener( 'mousemove', (e) => this.onMouseMove(e), false );
    }
}

const interact = new MouseInteractions();
interact.addInteractions(basic);

render();


function render() {
    interact.raycaster.setFromCamera( interact.mouse, basic.camera );
    requestAnimationFrame(render);

    basic.update();
    // controls.update();
}

