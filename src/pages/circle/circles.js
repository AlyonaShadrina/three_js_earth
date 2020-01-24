import { CircleBufferGeometry, MeshBasicMaterial } from 'three';
import { random } from '../../helpers';

const colors = ['#434a3a', '#e4c663', '#eab9b5', '#ac1422', '#226c56', '#733e52', '#1a5c6a', '#789f8a', '#d21226']

const generateRandomCircles = (count = 7, maxRadius = 7) => {
    const circlesArray = [];
    for (let i = 0; i < count; i++) {
        let radius = random(1, maxRadius / 2);
        let x = random(-(maxRadius - radius), maxRadius - radius);
        let y = random(-(maxRadius - radius), maxRadius - radius);
        let sin = x / radius;
        // sin2(α) + cos2(α) = 1
        // let сos = Math.sqrt(1 - sin ** 2);
        // console.log('radius', radius);
        // console.log('x', x);
        // console.log('y', y);
        // console.log('sin', sin);
        // console.log('сos', сos);
        circlesArray.push({
            radius,
            segments: radius * 15,
            // geometry: [radius, radius * 15],
            position: {
                // y: y * сos,
                // x: x * сos,
                y: y * Math.cos(45 * (Math.PI / 180)),
                x: x * Math.cos(45 * (Math.PI / 180)),
            },
            materialProps: {
                color: colors[random(0, colors.length - 1)],
                transparent: true,
                opacity: .5,
            },
        })
    }
    return circlesArray;
}

export function addCircles(scene, count, maxRadius) {
    generateRandomCircles(count, maxRadius).map((circle, i) => {
        scene.createElement({
            geometry: new CircleBufferGeometry(circle.radius, circle.segments),
            material: new MeshBasicMaterial(circle.materialProps),
            position: circle.position,
            name: `circle-${i}`
        })
    })
}