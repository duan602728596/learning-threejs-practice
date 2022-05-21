import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  BoxGeometry,
  MeshBasicMaterial, // 简单的材质
  MeshDepthMaterial, // 一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远
  Mesh,
  DoubleSide,
  MultiplyBlending
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils'; // 联合材质
import Stats from 'three/examples/jsm/libs/stats.module';

/* 场景 */
const scene = new Scene();

// scene.overrideMaterial = new MeshDepthMaterial(); // 应用到每个物体

/* 相机 */
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 5, 200);

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

/* 根据不同的材质创建Mesh */
function createMesh(Material, position) {
  const boxGeometry = new BoxGeometry(3, 3, 3);
  const boxMaterial = new Material({
    color: 0xaaeeaa * 0.4,
    shadowSide: DoubleSide,
    side: DoubleSide
  });
  const box = new Mesh(boxGeometry, boxMaterial);

  box.position.set(...position);

  return box;
}

const mesh1 = createMesh(MeshBasicMaterial, [-5, 0, 0]);
const mesh2 = createMesh(MeshDepthMaterial, [0, 0, 0]);

scene.add(mesh1);
scene.add(mesh2);

/* 联合材质 */
const mesh3 = createMultiMaterialObject(new BoxGeometry(3, 3, 3), [
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

/* 实时渲染 */
function renderMain() {
  stats.update();
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
