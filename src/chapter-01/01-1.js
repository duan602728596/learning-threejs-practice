import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  PlaneGeometry,
  MeshDepthMaterial,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  SpotLight,
  Vector2
} from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'dat.gui';

const scene = new Scene(); // 场景
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1_000); // 相机
const renderer = new WebGLRenderer(); // 渲染器

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

function handleWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize);

/* 控制器 */
// const trackballControls = new TrackballControls(camera, renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);

/* AxesHelper */
const axesHelper = new AxesHelper(20);

scene.add(axesHelper);

/* plane */
const planeGeometry = new PlaneGeometry(60, 20);
const planeMaterial = new MeshLambertMaterial({
  color: 0xaaaaaa
});
const plane = new Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

/* cube */
const cubeGeometry = new BoxGeometry(4, 4, 4);
const cubeMaterial = new MeshLambertMaterial({
  color: 0xff0000,
  wireframe: false
});
const cube = new Mesh(cubeGeometry, cubeMaterial);

cube.position.set(-4, 3, 0);
cube.castShadow = true;
scene.add(cube);

/* sphere */
const sphereGeometry = new SphereGeometry(4, 20, 20);
const sphereMaterial = new MeshLambertMaterial({
  color: 0x7777ff,
  wireframe: false
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(20, 4, 2);
sphere.castShadow = true;
scene.add(sphere);

/* 光源 */
const spotLight = new SpotLight(0xffffff);

spotLight.position.set(-40, 40, 15);
spotLight.castShadow = true;
spotLight.shadow.mapSize = new Vector2(1024, 1024);
spotLight.shadow.camera.far = 130;
spotLight.shadow.camera.near = 40;
scene.add(spotLight);

/* stats */
const stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

/* render */
document.getElementById('app').appendChild(renderer.domElement);

/* dat.GUI */
const controls = new function () {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
};
const gui = new GUI();

gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'bouncingSpeed', 0, 0.5);

/* 修改弧度 */
const MAX_RADIAN = 2 * Math.PI;

function cubeRotationChange(key) {
  // cube.rotation[key] += 0.02;
  cube.rotation[key] += controls.rotationSpeed;
  cube.rotation[key] >= MAX_RADIAN && (cube.rotation[key] = 0);
}

/* 让小球跳跃 */
let sphereStep = 0;

function sphereStepChange() {
  // sphereStep += 0.04;
  sphereStep += controls.bouncingSpeed;
  sphereStep >= MAX_RADIAN && (sphereStep = 0);
  sphere.position.x = 20 + 10 * Math.cos(sphereStep);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(sphereStep));
}

/* 实时渲染 */
function renderMain() {
  stats.update();

  // 方块修改弧度
  cubeRotationChange('x');
  cubeRotationChange('y');
  cubeRotationChange('z');

  // 小球跳跃
  sphereStepChange();
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
