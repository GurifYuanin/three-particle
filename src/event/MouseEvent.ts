import * as THREE from 'three';
import Event from './Event';
import Emitter from '../emitter/Emitter';
import { ParticleInterface, Particle } from '../particle/Particle';

const renderers: THREE.WebGLRenderer[] = [];
const raycasters: THREE.Raycaster[] = [];
const mouses: THREE.Vector2[] = [];

class MouseEvent extends Event {
  raycaster: THREE.Raycaster; // 光线追踪
  mouse: THREE.Vector2; // 记录光标所在位置， x = [-1, 1], y = [-1, 1]
  // 是否为主事件
  // 当用户为同一个渲染器和发射器添加多个事件时，可以避免重复计算
  isPrimaryEvent: boolean;

  camera: THREE.Camera;
  intersectionParticles: ParticleInterface[]; // 光标悬浮位置的粒子

  onMouseEnter: (particles: ParticleInterface[]) => void;
  onMouseMove: (particles: ParticleInterface[]) => void;
  onMouseLeave: (particles: ParticleInterface[]) => void;
  onMouseClick: (particles: ParticleInterface[]) => void;

  constructor({
    camera = null,
    renderer = null,
    onMouseEnter = (particles: ParticleInterface[]) => {},
    onMouseMove = (particles: ParticleInterface[]) => {},
    onMouseLeave = (particles: ParticleInterface[]) => {},
    onMouseClick = (particles: ParticleInterface[]) => {},
    ...options
  } = {}) {
    super(options || {});
    this.camera = camera;
    this.onMouseEnter = onMouseEnter;
    this.onMouseMove = onMouseMove;
    this.onMouseLeave = onMouseLeave;
    this.onMouseClick = onMouseClick;
    this.intersectionParticles = [];

    // renderer 和 camera 都是必须参数，缺少则报错
    if (!(renderer instanceof THREE.WebGLRenderer && camera instanceof THREE.Camera)) {
      throw new Error('The arguments of camera and renderer are required');
    }
    
    const rendererIndex: number = renderers.indexOf(renderer);
    if (rendererIndex === -1) {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.isPrimaryEvent = true;
      
      const canvasEl: HTMLCanvasElement = renderer.domElement;
      canvasEl.addEventListener('mousemove', (event) => {
        // 将光标在 DOM 中为位置转化为画布内的相对坐标
        const canvasRect: DOMRect | ClientRect = canvasEl.getBoundingClientRect();
        this.mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
      }, false);
      canvasEl.addEventListener('click', (event) => {
        this.onMouseClick(this.intersectionParticles);
      }, false);

      raycasters.push(this.raycaster);
      mouses.push(this.mouse);
      renderers.push(renderer);
    } else {
      // 为了避免重复添加事件，缓存已经添加过的事件
      this.raycaster = raycasters[rendererIndex];
      this.mouse = mouses[rendererIndex];
      this.isPrimaryEvent = false;
    }
  }

  effect(particles: ParticleInterface[], emitter: Emitter): void {
    super.effect(particles, emitter);
    if (this.isPrimaryEvent) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
    }

    // 获得当前时刻光标悬浮地方的粒子
    // intersectionParticles 表示当前时刻的粒子
    // this.intersectionParticles 表示上一时刻的粒子
    const intersectionParticles: ParticleInterface[] = this.raycaster.intersectObjects(particles)
      .map((intersection: THREE.Intersection) => intersection.object as ParticleInterface);

    let enterIntersectionParticles: ParticleInterface[] = [] // 获得光标进入的粒子
    let leaveIntersectionParticles: ParticleInterface[] = []; // 获得光标离开的粒子

    // 感觉这种实现方式会有很大的性能消耗
    if (intersectionParticles.length !== this.intersectionParticles.length) {
      if (intersectionParticles.length < this.intersectionParticles.length) {
        leaveIntersectionParticles = this.intersectionParticles
          .filter((particle: ParticleInterface) => !intersectionParticles.includes(particle));
      } else {
        enterIntersectionParticles = intersectionParticles
          .filter((particle: ParticleInterface) => !this.intersectionParticles.includes(particle));
      }
    }

    this.onMouseEnter(enterIntersectionParticles);
    this.onMouseMove(intersectionParticles);
    this.onMouseLeave(leaveIntersectionParticles);
    this.intersectionParticles = intersectionParticles;
  }
}

export default MouseEvent;