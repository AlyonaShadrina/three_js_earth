import { Geometry, Vector3, LineBasicMaterial, Line } from 'three';


export const addLine = ({ builder, name, position, rotation, size }) => {
    const geometry = new Geometry();
    geometry.vertices.push(new Vector3( -size, 0, 0 ) );
    geometry.vertices.push(new Vector3( size, 0, 0 ) );

    builder.createElement({
        geometry,
        material: new LineBasicMaterial({ color: 'magenta', linewidth: 2 }),
        element: Line,
        position,
        rotation,
        name,
    })
}

export const createGrid = ({ builder, cell, count, size }) => {
    for (let i = 0; i <= count; i++) {
        addLine({
            builder,
            name: `linex-${i}`,
            position: {
                z: (i * cell) - size,
            },
            size,
        });
        addLine({
            builder,
            name: `liney-${i}`,
            position: {
                x: (i * cell) - size,
            },
            rotation: {
                y: 90 * Math.PI / 180,
            },
            size,
        });
    }
}