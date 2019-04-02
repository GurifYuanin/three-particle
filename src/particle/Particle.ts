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
  emitting: boolean; // 该粒子是否可以被发射
  constructor({
    life = 3,
    lifeRandom = 0, // 生命随机比例
    velocity = 10,
    border = 5,
  } = {}) {
    this.clock = new THREE.Clock();
    this.clock.start();
    this.life = life + THREE.Math.randFloatSpread(lifeRandom);
    this.direction = new THREE.Vector3(0, 1, 0); // 粒子运动方向由发射器控制，不受参数影响
    this.velocity = velocity;
    this.border = border;
    this.emitting = true;
  }
}

// Particle 接口，用于解决 ts 不识别 Particle.prototype.call 而报错的尴尬情况
interface ParticleInterface extends THREE.Object3D, Particle {
  geometry: THREE.Geometry | THREE.BufferGeometry,
  material: THREE.Material
}



export { Particle, ParticleInterface };