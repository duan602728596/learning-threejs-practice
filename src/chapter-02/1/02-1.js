import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  Mesh,
  AmbientLight,
  SpotLight,
  BoxGeometry,
  Fog
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new Scene(); // 场景
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1_000); // 相机
const renderer = new WebGLRenderer(); // 渲染器

scene.fog = new Fog(0xffffff, 0.015, 100); // 雾化效果
// scene.overrideMaterial = new MeshLambertMaterial({ color: 0xffffff }); // 使用相同的材质和颜色

renderer.setClearColor(new Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);
scene.add(camera);

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

/* plane */
const planeGeometry = new PlaneGeometry(60, 40, 1, 1);
const planeMaterial = new MeshLambertMaterial({ color: 0xaaaaaa * 0.4 });
const plane = new Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

/* ambientLight */
const ambientLight = new AmbientLight({ color: 0x3c3c3c });

scene.add(ambientLight);

/* spotLight */
const spotLight = new SpotLight(0xffffff, 1.2, 150, 120);

spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
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
  this.numberOfObjects = scene.children.length;

  this.removeCube = function () {
    const allChildren = scene.children;
    const lastObject = allChildren.at(-1);

    if (lastObject instanceof Mesh) {
      scene.remove(lastObject);
      this.numberOfObjects = scene.children.length;
    }
  };

  this.addCube = function () {
    const cubeSize = Math.ceil((Math.random() * 3));
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });
    const cube = new Mesh(cubeGeometry, cubeMaterial);

    cube.castShadow = true;
    cube.name = `cube-${ scene.children.length }`;
    cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
    cube.position.y = Math.round((Math.random() * 5));
    cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

    scene.add(cube);
    this.numberOfObjects = scene.children.length;
  };

  this.outputObjects = function () {
    console.log(scene.children);
  }
};
const gui = new GUI();

gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'addCube');
gui.add(controls, 'removeCube');
gui.add(controls, 'outputObjects');
gui.add(controls, 'numberOfObjects').listen();

/* 修改弧度 */
const MAX_RADIAN = 2 * Math.PI;

function cubeRotationChange(e, key) {
  e.rotation[key] += controls.rotationSpeed;
  e.rotation[key] >= MAX_RADIAN && (e.rotation[key] = 0);
}

/* 实时渲染 */
function renderMain() {
  stats.update();

  scene.traverse(function (e) {
    if (e instanceof Mesh && e !== plane) {
      cubeRotationChange(e, 'x');
      cubeRotationChange(e, 'y');
      cubeRotationChange(e, 'z');
    }
  });

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderMain);
}

renderMain();
