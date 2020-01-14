import { random } from '../../helpers';

const colors = ['#434a3a', '#e4c663', '#eab9b5', '#ac1422', '#226c56', '#733e52', '#1a5c6a', '#789f8a', '#d21226']

const generateRandomCircles = (count = 7, maxRadius = 7) => {
    const circlesArray = [];
    for (let i = 0; i < count; i++) {
        let radius = random(1, maxRadius / 2);
        // let x = -(maxRadius - radius); // temp for debug
        let x = random(-(maxRadius - radius), maxRadius - radius);
        // let y = random(-1, 1); // that solves issue on moving
        let y = random(-(maxRadius - radius), maxRadius - radius);
        // console.log('-(maxRadius - radius)', -(maxRadius - radius));
        let sin = x / radius;
        // sin2(α) + cos2(α) = 1
        // let сos = Math.sqrt(1 - sin ** 2);
        // console.log('radius', radius);
        // console.log('x', x);
        // console.log('y', y);
        // console.log('sin', sin);
        // console.log('сos', сos);
        circlesArray.push({
            geometry: [radius, radius * 15],
            position: {
                // y: y * сos,
                // x: x * сos,
                y: y * Math.cos(45 * (Math.PI / 180)),
                x: x * Math.cos(45 * (Math.PI / 180)),
            },
            material: {
                color: colors[random(0, colors.length - 1)],
                transparent: true,
                opacity: .5,
            },
        })
    }
    return circlesArray;
}

export function addCircles(scene, count, maxRadius) {
    generateRandomCircles(count, maxRadius).map(cirlce => {
        scene.createMesh({
            geometry: {
                type: 'Circle',
                props: cirlce.geometry,
            },
            material: {
                type: 'Basic',
                props: {
                    color: 'red',
                    ...cirlce.material,
                },
            },
            position: cirlce.position,
        })
    })
}