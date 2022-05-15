import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  AmbientLight
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

/* 场景 */
const scene = new Scene();

/* 渲染器相关 */
const renderer = new WebGLRenderer();

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

/* 相机相关 */
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1_000); // 相机

camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

function handleWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize);

/* 控制器 */
const orbitControls = new OrbitControls(camera, renderer.domElement);

/* AxesHelper */
const axesHelper = new AxesHelper(20);

scene.add(axesHelper);

/* stats */
const stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

/* render */
document.getElementById('app').appendChild(renderer.domElement);

/* sphere */
const sphereGeometry = new SphereGeometry(4, 20, 20);
const sphereMaterial = new MeshLambertMaterial({
  color: 0xffffff,
  wireframe: false
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(0, 0, 0);
sphere.castShadow = true;
scene.add(sphere);

/* 光源 */
const light = new AmbientLight(0x606008);

scene.add(light);

/* GUI */
const controls = new function () {
  this.intensity = light.intensity;
  this.ambientColor = light.color.getStyle();
  this.disableSpotlight = false;
};
const gui = new GUI();

function handleGuiControlsChange (e) {
  light.color = new Color(controls.ambientColor);
  light.intensity = controls.intensity;
}

gui.add(controls, 'intensity', 0, 3, 0.1).onChange(handleGuiControlsChange);
gui.addColor(controls, 'ambientColor').onChange(handleGuiControlsChange);
gui.add(controls, 'disableSpotlight').onChange((e) => light.visible = !e);

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
