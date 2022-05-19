import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  PlaneGeometry,
  AmbientLight,
  SpotLight,
  CameraHelper,
  SpotLightHelper
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

sphere.position.set(0, 10, 0);
sphere.castShadow = true;
scene.add(sphere);

/* 四边形 */
const planeGeometry = new PlaneGeometry(60, 40, 1, 1);
const planeMaterial = new MeshLambertMaterial({ color: 0xaaaaaa * 0.4 });
const plane = new Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
plane.receiveShadow = true; // 动态阴影
scene.add(plane);

/* 光源 */
// 环境光
const ambientLight = new AmbientLight(0x606008);

scene.add(ambientLight);

// 聚光灯
const spotLight = new SpotLight(0xffffff);

spotLight.position.set(0, 60, 30);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 120;
spotLight.target = sphere;
spotLight.distance = 0; // 衰减
spotLight.angle = 0.4;  // 聚光灯的最大范围，以弧度为单位，从其方向

scene.add(spotLight);

const spotLightHelper = new SpotLightHelper(spotLight);

scene.add(spotLightHelper);

const spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);

scene.add(spotLightCameraHelper);

/* GUI */
const controls = new function () {
  this.intensity = ambientLight.intensity;
  this.ambientColor = ambientLight.color.getStyle();
  this.disableSpotlight = false;
};
const gui = new GUI();

function handleGuiControlsChange (e) {
  ambientLight.color = new Color(controls.ambientColor);
  ambientLight.intensity = controls.intensity;
}

gui.add(controls, 'intensity', 0, 3, 0.1).onChange(handleGuiControlsChange);
gui.addColor(controls, 'ambientColor').onChange(handleGuiControlsChange);
gui.add(controls, 'disableSpotlight').onChange((e) => ambientLight.visible = !e);

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  spotLightHelper.update();
  spotLightCameraHelper.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
