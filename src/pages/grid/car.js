import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import car from '../../assets/tesla_cybertruck/out.glb';


export const addCar = ({ builder, onload }) => {
    var loader = new GLTFLoader();

    loader.load(car, function (gltf) {
        gltf.scene.position.y = 120;
        gltf.scene.rotation.y = Math.PI;
        gltf.scene.position.z = 320;
        builder.scene.add(gltf.scene);
        onload();
    }, undefined, function (error) {
        console.error(error);
    });
}