import * as THREE from 'three';

class Particle {
  static readonly TRANSFORM_LINEAR: number = 0; // 线性插值
  static readonly TRANSFORM_SMOOTH: number = 1; // 平滑插值
  static readonly TRANSFORM_SMOOTHER: number = 2; // 更平滑的插值
  clock: THREE.Clock; // 生命时钟
  velocity: number; // 粒子移动速度
  life: number; // 粒子生命长度，单位 s
  direction: THREE.Vector3; // 粒子运动方向
  border: number; // 边界半径，用于碰撞检测
  emitting: boolean; // 粒子是否可以被发射
  constructor({
    life = 3,
    velocity = 10,
  } = {}) {
    this.clock = new THREE.Clock();
    this.clock.start();
    this.life = life;
    this.direction = new THREE.Vector3(0, 0, 0);
    this.velocity = velocity;
    this.border = 1;
    this.emitting = true;
  }
}

interface ParticleInterface extends THREE.Object3D, Particle {
  geometry: THREE.Geometry | THREE.BufferGeometry,
  material: THREE.Material
}


export { Particle, ParticleInterface };