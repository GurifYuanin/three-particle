import * as THREE from 'three';
import { ParticleInterface } from '../particle/Particle';
import Physical from './Physical';

class Wind extends Physical {
  direction: THREE.Vector3; // 风方向
  intensity: number; // 风力
  spread: number; // 风发散值
  constructor({
    direction = new THREE.Vector3(1, 0, 0),
    intensity = 1,
    spread = 0,
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction;
    this.intensity = intensity;
    this.spread = spread;
  }

  effect(particle: ParticleInterface): void {
    super.effect(particle);
    particle.velocity = particle.direction.add(
      this.direction
        .clone()
        .multiplyScalar(this.intensity)
        .addScalar(THREE.Math.randFloatSpread(this.spread))
    ).length();
    particle.direction.divideScalar(particle.velocity); // 单位向量化
  }
}

export default Wind;
