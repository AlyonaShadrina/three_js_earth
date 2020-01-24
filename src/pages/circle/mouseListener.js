export const mouseListener = (e, thisThree) => {

    const { domElement } = thisThree.renderer;

    const radius = thisThree.scene.getObjectByName('ring').geometry.parameters.innerRadius;

    const coordX = e.clientX - domElement.width / 2;
    const coordY = e.clientY - domElement.height / 2;

    thisThree.scene.children.map(mesh => {

        if (mesh.name.includes('circle')) {
            const circleRadius = mesh.geometry.parameters.radius;

            const speed = 5000 * circleRadius;

            const vec = {
                x: (coordX - mesh.position.x),
                y: (-coordY - mesh.position.y),
            };

            const centerPositionRadius = (mesh.position.x + (vec.x * 1 / speed)) ** 2 + (mesh.position.y + (vec.y * 1 / speed)) ** 2;

            if (centerPositionRadius <= (radius - circleRadius) ** 2) {
                mesh.position.x += (vec.x * 1 / speed);
                mesh.position.y += (vec.y * 1 / speed);
            }
        }
        // if (mesh.name.includes('line')) {
        //     let { x, y } = mesh.geometry.vertices[0];
        //
        //     const vec = {
        //         x: (coordX - x),
        //         y: (-coordY - y),
        //     };
        //
        //     const speed = .1
        //
        //     const centerPosition = (x + (vec.x * 1/speed)) ** 2 + (y + (vec.y * 1/speed)) ** 2;
        //
        //     // if (centerPosition <= radius ** 2 ) {
        //     //     console.log('move');
        //         mesh.geometry.vertices[0].x += (vec.x * 1/speed);
        //         mesh.geometry.vertices[0].y += (vec.y * 1/speed);
        //         // mesh.position.x += (vec.x * 1/speed);
        //         // mesh.position.y += (vec.y * 1/speed);
        //     // }
        //
        // }
    })

};