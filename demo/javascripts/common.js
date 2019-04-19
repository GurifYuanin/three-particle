document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.style.border = 'none';
document.body.style.overflow = 'hidden';

// 初始化右上角控制面板
const controlPanelEl = document.getElementById('control-panel');
if (controlPanelEl) {
  if (window.innerWidth > 768) {
    controlPanelEl.style.position = 'absolute';
    controlPanelEl.style.top = '0';
    controlPanelEl.style.right = '0';
    controlPanelEl.style.color = 'white';
    controlPanelEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    controlPanelEl.style.padding = '10px';
  } else {
    controlPanelEl.style.display = 'none';
  }
}

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

// icon
const faviconEl = document.createElement('link');
faviconEl.setAttribute('ref', 'shortcut icon');
faviconEl.setAttribute('href', '../../favicon.ico');
faviconEl.setAttribute('type', 'image/x-icon');
document.head.appendChild(faviconEl);

// OrbitControls
const orbitControlsEl = document.createElement('script');
orbitControlsEl.src = './javascripts/OrbitControls.js';
document.body.append(orbitControlsEl);
window.addEventListener('load', () => {
  THREE.OrbitControls && new THREE.OrbitControls(camera, renderer.domElement);
});
