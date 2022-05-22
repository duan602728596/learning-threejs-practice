import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  BoxGeometry,
  MeshBasicMaterial,    // 简单的材质
  MeshDepthMaterial,    // 一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远
  MeshLambertMaterial,  // 创建暗淡的并不光亮的表面
  MeshPhongMaterial,    // 光亮材质
  MeshStandardMaterial, // 更加正确的材质
  MeshPhysicalMaterial,
  ShaderMaterial, // 自定义着色器
  Mesh,
  DoubleSide,
  MultiplyBlending,
  SpotLight,
  SpotLightHelper,
  PointLight,
  PointLightHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils'; // 联合材质
import Stats from 'three/examples/jsm/libs/stats.module';

/* 场景 */
const scene = new Scene();

// scene.overrideMaterial = new MeshDepthMaterial(); // 应用到每个物体

/* 相机 */
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1.5, 200);

camera.position.set(10, 10, 10); // 红x绿y蓝z
camera.lookAt(scene.position);

/* 渲染器 */
const renderer = new WebGLRenderer(); // 渲染器

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('app').appendChild(renderer.domElement);

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

const boxGeometry = new BoxGeometry(3, 3, 3);

/* 基础材质 */
const mesh1 = new Mesh(boxGeometry, new MeshBasicMaterial({
  color: 0xaaeeaa * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide
}));

mesh1.position.set(-5, 0, 0);
scene.add(mesh1);

/*  一种按相机深度绘制几何体的材质 */
const mesh2 = new Mesh(boxGeometry, new MeshDepthMaterial({
  color: 0xaaeeaa * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide
}));

mesh2.position.set(0, 0, 0);
scene.add(mesh2);

/* 联合材质 */
const mesh3 = createMultiMaterialObject(boxGeometry, [
  new MeshDepthMaterial(),
  new MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    side: DoubleSide,
    blending: MultiplyBlending
  })
]);

mesh3.position.set(5, 0, 0);
scene.add(mesh3);


/* 多材质 */
const mesh4 = new Mesh(boxGeometry, [
  new MeshBasicMaterial({ color: 0xff0000 }), // 红色
  new MeshBasicMaterial({ color: 0xff9900 }), // 橘黄色
  new MeshBasicMaterial({ color: 0x0000ff }), // 蓝色
  new MeshBasicMaterial({ color: 0x00ff00 }), // 绿色
  new MeshBasicMaterial({ color: 0xff00ff }), // 粉色
  new MeshBasicMaterial({ color: 0x9900ff })  // 紫色
]);

mesh4.position.set(-5, 0, 5);
scene.add(mesh4);

/* 暗淡的并不光亮的表面 */
const mesh5 = new Mesh(boxGeometry, new MeshLambertMaterial({
  color: 0x7777ff,
  // emissive: 0x7777ff // 自发光
}));

mesh5.position.set(0, 0, 5);
scene.add(mesh5);

/* 光亮材质 */
const mesh6 = new Mesh(boxGeometry, new MeshPhongMaterial({
  color: 0x0dd8cc,
  specular: 0x0dd8cc
}));

mesh6.position.set(-5, 0, 10);
scene.add(mesh6);

/* 更加正确的物理材质 */
const mesh7 = new Mesh(boxGeometry, new MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.8,
  roughness: 0.4
}));

mesh7.position.set(5, 0, 10);
scene.add(mesh7);

const mesh8 = new Mesh(boxGeometry, new MeshPhysicalMaterial({
  color: 0xffffff,
  clearcoat: 0.5,
  clearcoatRoughness: 0.5,
  reflectivity: 0.3
}));

mesh8.position.set(0, 0, 15);
scene.add(mesh8);

/* 聚光灯 */
const spotLight = new SpotLight(0xffffff);

spotLight.position.set(50, 50, 50);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 120;
spotLight.target = scene;
spotLight.angle = 0.4;  // 聚光灯的最大范围，以弧度为单位，从其方向

const spotLightHelper = new SpotLightHelper(spotLight);

scene.add(spotLight, spotLightHelper);

/* 点光源 */
const pointLight = new PointLight(0xff00ff);

pointLight.position.set(0, 5, 10);
pointLight.distance = 30;
pointLight.castShadow = true;

const pointLightHelper = new PointLightHelper(pointLight);

scene.add(pointLight, pointLightHelper);

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  spotLightHelper.update();
  pointLightHelper.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
