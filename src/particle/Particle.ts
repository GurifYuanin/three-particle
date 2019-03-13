import * as THREE from 'three';

class Particle {
  static readonly TRANSFORM_LINEAR: number = 0; // 线性插值
  static readonly TRANSFORM_SMOOTH: number = 1; // 平滑插值
  static readonly TRANSFORM_SMOOTHER: number = 2; // 更平滑的插值
  clock: THREE.Clock; // 生命时钟
  life: number; // 粒子生命长度，单位 s
  direction: THREE.Vector3; // 粒子运动方向
  emitting: boolean; // 粒子是否进行运动
  constructor({
    life = 3
  } = {}) {
    this.clock = new THREE.Clock();
    this.clock.start();
    this.life = life;
    this.direction = new THREE.Vector3(0, 0, 0);
    this.emitting = true;
  }
}

interface ParticleInterface extends THREE.Object3D, Particle {
  geometry: THREE.Geometry | THREE.BufferGeometry,
  material: THREE.Material
}


export { Particle, ParticleInterface };