import { MeshBasicMaterial, RingBufferGeometry } from 'three';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import "../../navigation";
import "../../style.css";

import ThreeSceneBuilder from '../../ThreeSceneBuilder/ThreeSceneBuilder';
import { addCircles } from './circles';
import { addLines } from './lines';


const radius = 7;

const basic = new ThreeSceneBuilder();
basic.initRenderer()
    .initScene({
        background: new THREE.Color('#e1d1c2'),
    })
    .initCamera()
    .initLight()
    .createElement({
        geometry: new RingBufferGeometry(radius, radius + .5, radius * 15),
        material: new MeshBasicMaterial({  color: '#1c2124' }),
        name: 'ring'
    });

// addLines(basic, 10, radius);
addCircles(basic, 12, radius);

const mouseListener = (e, thisThree) => {

    const { domElement } = thisThree.renderer;

    thisThree.scene.children.map(mesh => {

        if (mesh.name.includes('circle')) {
            const circleRadius = mesh.geometry.parameters.radius;

            const speed = 10000 * circleRadius;

            const coordX = e.clientX - domElement.width / 2;
            const coordY = e.clientY - domElement.height / 2;

            const vec = {
                x: (coordX - mesh.position.x),
                y: (-coordY - mesh.position.y),
            };

            if ((mesh.position.x + (vec.x * 1/speed)) ** 2 + (mesh.position.y + (vec.y * 1/speed)) ** 2 <= radius ** 2) {
                mesh.position.x += (vec.x * 1/speed);
                mesh.position.y += (vec.y * 1/speed);
            }
        }

    })

};

basic.addEventListener({
    type: 'mousemove',
    listener: mouseListener,
})

// const controls = new TrackballControls(basic.camera, basic.renderer.domElement);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.keys = [65, 83, 68];

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
    // controls.update();
}


function radToDeg(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}