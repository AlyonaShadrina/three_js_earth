import ThreeSceneBuilder from '../ThreeSceneBuilder/ThreeSceneBuilder';
import "../style.css";
import "../navigation";

const basic = new ThreeSceneBuilder();
basic.initRenderer()
     .initScene()
     .initCamera()
     .createLight()
     .createElement();

render();

function render() {
    requestAnimationFrame(render);
    basic.update();
}