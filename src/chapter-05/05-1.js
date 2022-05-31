import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  MeshBasicMaterial, // 基础材质
  DoubleSide,
  Mesh,
  PlaneGeometry,  // 二维几何体
  CircleGeometry, // 圆
  RingGeometry,   // 圆弧
  Shape,
  Path,
  Vector2,
  ShapeGeometry   // 自定义二维图形
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

/**
 * 角度转弧度
 * @param { number } degrees: 角度
 * @return {number}: 弧度
 */
function deg2rad(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * 弧度转角度
 * @param { number } radians: 弧度
 * @return {number}: 角度
 */
function rad2deg(radians) {
  return radians * 180 / Math.PI;
}

/* 场景 */
const scene = new Scene();

/* 相机 */
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

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

/* 材质 */
const material = new MeshBasicMaterial({
  color: 0xaaeeaa * 0.4,
  shadowSide: DoubleSide,
  side: DoubleSide,
  wireframe: true // 渲染为线条
});

/* 几何体 */
function createMesh(geometry, position) {
  const plane = new Mesh(geometry, material);

  plane.position.set(...position);
  scene.add(plane);

  return plane;
}

createMesh(new PlaneGeometry(2, 2, 3, 3), [0, 0, 0]); // 二维几何体
createMesh(new CircleGeometry(1, 30), [3, 0, 0]); // 圆
createMesh(new RingGeometry(0.5, 1, 30, 3), [6, 0, 0]); // 圆弧
createMesh(new ShapeGeometry((() => {
  const shape = new Shape();

  shape.moveTo(10, 10);
  shape.lineTo(10, 40);
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
  shape.splineThru([new Vector2(32, 30), new Vector2(28, 20), new Vector2(30, 10)]);
  shape.quadraticCurveTo(20, 15, 10, 10);

  const hole = [new Path(), new Path(), new Path()];

  hole[0].absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
  hole[1].absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
  hole[2].absellipse(20, 16, 2, 0, Math.PI * 2, true);
  shape.holes.push(...hole);

  return shape;
})()), [0, 0, 0]); // 自定义图形

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();