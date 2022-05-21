import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  AxesHelper,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  SphereGeometry,
  PlaneGeometry,
  DoubleSide,
  AmbientLight,
  PointLight,
  PointLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Object3D,
  TextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import Stats from 'three/examples/jsm/libs/stats.module';

/* 场景 */
const scene = new Scene();

/* 渲染器 */
const renderer = new WebGLRenderer();

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('app').appendChild(renderer.domElement);

/* 相机 */
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1_000);

camera.position.set(-10, 10, 10);
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

/* 四面体 */
const boxGeometry = new BoxGeometry(3, 3, 3);
const boxMaterial = new MeshPhongMaterial({
  color: 0xaaeeaa * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide
});
const box = new Mesh(boxGeometry, boxMaterial);

box.castShadow = true;
box.position.set(-5, 0, 0);
scene.add(box);

/* 球体 */
const sphereGeometry = new SphereGeometry(1, 20, 20);
const sphereMaterial = new MeshPhongMaterial({
  color: 0xff00ff * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(5, 0, 0);
sphere.castShadow = true;
scene.add(sphere);

/* 四边形 */
const planeGeometry = new PlaneGeometry(25, 25, 1, 1);
const planeMaterial = new MeshPhongMaterial({
  color: 0xaaaaaa * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide
});
const plane = new Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, -2, 0);
plane.receiveShadow = true; // 动态阴影
scene.add(plane);

/* 光源 */
// 环境光
const ambientLight = new AmbientLight(0xffffff);

scene.add(ambientLight);

// 点光源
const pointLight = new PointLight(0xff0000);

pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.target = plane;
pointLight.distance = 200;
scene.add(pointLight);

const pointLightHelper = new PointLightHelper(pointLight);

scene.add(pointLightHelper);

// 平行光
const directionalLight = new DirectionalLight(0xffffff);
const directionalLightObject3D = new Object3D();

directionalLightObject3D.position.set(5, 5, 5);
directionalLight.position.set(4, 4, 4);
directionalLight.castShadow = true;
directionalLight.target = directionalLightObject3D;
scene.add(directionalLight);

const directionalLightHelper = new DirectionalLightHelper(directionalLight);

scene.add(directionalLightHelper);

// 加载镜头光晕
const textureLoader = new TextureLoader();
const lensflare0Texture = textureLoader.load('/lensflare0.png');
const lensFlare = new Lensflare();

lensFlare.addElement(new LensflareElement(lensflare0Texture, 200, 1));
scene.add(lensFlare);

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  pointLightHelper.update();
  directionalLightHelper.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();

