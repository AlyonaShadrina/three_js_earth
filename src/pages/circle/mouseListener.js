const direction = {
    x: null,
    y: null,
};
let oldCoords = {
    x: null,
    y: null,
};

export const mouseListener = (e, thisThree, radius = 7) => {

    if (e.pageX < oldCoords.x) {
        direction.x = "left"
    } else if (e.pageX > oldCoords.x) {
        direction.x = "right"
    }

    if (e.pageY < oldCoords.y) {
        direction.y = "top"
    } else if (e.pageY > oldCoords.y) {
        direction.y = "bottom"
    }

    oldCoords = {
        x: e.pageX,
        y: e.pageY,
    };

    const moveCoef = 0.05;

    const { domElement } = thisThree.renderer;

    const coordX = e.clientX - domElement.width / 2;
    const coordY = e.clientY - domElement.height / 2;
    const meshes = thisThree.meshes;

    Object.keys(meshes).map(meshName => {

        const { mesh } = meshes[meshName];
        if (mesh.position && meshName != 'ring') {
            const circleRadius = mesh.geometry.parameters.radius;

            const moveFormula = (1 / circleRadius) * moveCoef;

            if ((mesh.position.x + moveFormula + circleRadius <= radius)
                && direction.x === 'right'
            ) {
                mesh.position.x += moveFormula;
            } else if ((mesh.position.x - moveFormula - circleRadius >= -radius)
                && direction.x === 'left'
            ) {
                mesh.position.x -= moveFormula;
            }

            if ((mesh.position.y + moveFormula + circleRadius <= radius)
                && direction.y === 'top'
            ) {
                mesh.position.y += moveFormula;
            } else if ((mesh.position.y - moveFormula - circleRadius >= -radius)
                && direction.y === 'bottom'
            ) {
                mesh.position.y -= moveFormula;
            }
        }

    })

};