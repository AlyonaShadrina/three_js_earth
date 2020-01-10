import ThreeSceneBuilder from '../ThreeSceneBuilder/ThreeSceneBuilder';


const basic = new ThreeSceneBuilder();
basic.initRenderer()
     .initScene()
     .initCamera()
     .initLight()
     .createMesh();

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
}