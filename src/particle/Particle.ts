import * as THREE from 'three';

class Particle extends THREE.Mesh {
  static TRANSFORM_LINEAR: number = 0;
  static TRANSFORM_SMOOTH: number = 1;
  static TRANSFORM_SMOOTHER: number = 2;
  clock: THREE.Clock; // 生命时钟
  startTime: number; // 粒子创建时间，单位 s
  life: number; // 粒子生命长度，单位 s
  direction: THREE.Vector3;
  type: string;

  constructor({ geometry, material, life = 3 }) {
    super(geometry, material);
    this.clock = new THREE.Clock();
    this.clock.start();
    this.type = 'Particle';
    this.direction = new THREE.Vector3(
      THREE.Math.randFloatSpread(1),
      THREE.Math.randFloatSpread(1),
      THREE.Math.randFloatSpread(1)
    ).normalize();
    this.life = life;
  }
}
export default Particle;
