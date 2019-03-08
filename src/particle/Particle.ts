import * as THREE from 'three';

class Particle extends THREE.Mesh {
  static TRANSFORM_LINEAR: number = 0; // 线性插值
  static TRANSFORM_SMOOTH: number = 1; // 平滑插值
  static TRANSFORM_SMOOTHER: number = 2; // 更平滑的插值
  clock: THREE.Clock; // 生命时钟
  life: number; // 粒子生命长度，单位 s
  direction: THREE.Vector3; // 粒子运动方向
  type: string;

  constructor({ geometry, material, life = 3 }) {
    super(geometry, material);
    this.clock = new THREE.Clock();
    this.clock.start();
    this.direction = new THREE.Vector3(
      THREE.Math.randFloatSpread(1),
      THREE.Math.randFloatSpread(1),
      THREE.Math.randFloatSpread(1)
    ).normalize();
    this.life = life;
    this.type = 'Particle';
  }
}

export default Particle;
