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
    particle.direction.add(
      this.direction
        .clone()
        .multiplyScalar(this.intensity)
        .addScalar(THREE.Math.randFloatSpread(this.spread))
    );
    // particle.direction.x += THREE.Math.randFloatSpread(this.spread) + this.direction.x * this.intensity;
    // particle.direction.y += THREE.Math.randFloatSpread(this.spread) + this.direction.y * this.intensity;
    // particle.direction.z += THREE.Math.randFloatSpread(this.spread) + this.direction.z * this.intensity;
  }
}

export default Wind;
