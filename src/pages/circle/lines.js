import * as THREE from 'three';
import { random } from '../../helpers';


export function addLines(scene, count, maxCoord) {
    var material = new THREE.LineBasicMaterial({ color: 'grey' });

    const lines = generateRandomLines(count, maxCoord);
    console.log('lines', lines);
    lines.map(line => {
        const geometry = new THREE.Geometry();
        console.log('line', line);
        geometry.vertices.push(new THREE.Vector3(...line[0]));
        geometry.vertices.push(new THREE.Vector3(...line[1]));
        scene.scene.add(new THREE.Line(geometry, material));
    })

}

function generateRandomLines(count = 9, max = 7) {
    const array = [];
    for (let i = 0; i < count; i++) {
        let radius = random(1, count / 2);
        let x1 = random(-(max - radius), max - radius);
        let y1 = random(-(max - radius), max - radius);
        let x2 = random(-(max - radius), max - radius);
        let y2 = random(-(max - radius), max - radius);

        const line = [
            [x1 * Math.cos(45 * (Math.PI / 180)), y1 * Math.cos(45 * (Math.PI / 180)), 1],
            [x2 * Math.cos(45 * (Math.PI / 180)), y2 * Math.cos(45 * (Math.PI / 180)), 1],
        ];
        array.push(line)
    }
    return array;
}