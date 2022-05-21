import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  Mesh,
  AmbientLight,
  SpotLight,
  Vector3,
  BufferGeometry,
  MeshBasicMaterial,
  DoubleSide
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const scene = new Scene(); // 场景
// const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1_000); // 相机
const camera = new OrthographicCamera(
  window.innerWidth / -16,
  window.innerWidth / 16,
  window.innerHeight / 16,
  window.innerHeight / -16,
  -200,
  500
);
const renderer = new WebGLRenderer(); // 渲染器

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('app').appendChild(renderer.domElement);

// camera.position.set(-30, 40, 30);
camera.position.set(120, 60, 80);
camera.lookAt(scene.position);
scene.add(camera);

function handleWindowResize(event) {
  Object.assign(camera, {
    left: window.innerWidth / -16,
    right: window.innerWidth / 16,
    top: window.innerHeight / 16,
    bottom: window.innerHeight / -16,
  });
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize);

/* 控制器 */
const orbitControls = new OrbitControls(camera, renderer.domElement);

/* AxesHelper */
const axesHelper = new AxesHelper(20);

scene.add(axesHelper);

/* 四边形 */
const planeGeometry = new PlaneGeometry(60, 40, 1, 1);
const planeMaterial = new MeshLambertMaterial({ color: 0xaaaaaa * 0.4 });
const plane = new Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

/**
 * 自定义形状
 * https://sbcode.net/threejs/geometry-to-buffergeometry/
 */
const points = [
  new Vector3(0, 0, 0),
  new Vector3(5, 0, 0),
  new Vector3(5, 5, 0),

  new Vector3(0, 0, 0),
  new Vector3(0, 5, 0),
  new Vector3(5, 5, 0)
];
const geom = new BufferGeometry();

geom.setFromPoints(points);
geom.computeVertexNormals();

const geomMaterial = new MeshBasicMaterial({
  color: 0xff0000,
  side: DoubleSide,
  wireframe: true // 渲染为线条
});
const geomMesh = new Mesh(geom, geomMaterial);

geomMesh.position.set(0, 0, 0);
geomMesh.castShadow = true;
scene.add(geomMesh);

/* 环境光 */
const ambientLight = new AmbientLight({ color: 0x3c3c3c });

scene.add(ambientLight);

/* 聚光灯 */
const spotLight = new SpotLight(0xffffff, 1.2, 150, 120);

spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

/* stats */
const stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

/* 实时渲染 */
function renderMain() {
  stats.update();

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
