document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.style.border = 'none';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1, 1000);
scene.add(light);

// 添加返回上一步按钮
const backEl = document.createElement('div');
backEl.addEventListener('click', function () {
  window.history.back(-1);
});
document.body.append(backEl);
backEl.style.position = 'absolute';
backEl.style.left = '0';
backEl.style.top = '0';
backEl.style.opacity = '.5';
backEl.style.color = 'white';
backEl.style.cursor = 'pointer';
backEl.title = '返回上一个页面';
backEl.innerText = '←';

// OrbitControls
const orbitControlsEl = document.createElement('script');
orbitControlsEl.src = './javascripts/OrbitControls.js';
document.body.append(orbitControlsEl);
window.addEventListener('load', () => {
  THREE.OrbitControls && new THREE.OrbitControls(camera, renderer.domElement);
});
