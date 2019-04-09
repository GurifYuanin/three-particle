import * as THREE from 'three';
import { ParticleInterface } from '../particle/Particle';
import Physical from './Physical';

class Wind extends Physical {
  direction: THREE.Vector3; // 风方向
  intensity: THREE.Vector3; // 风力
  spread: THREE.Vector3; // 风发散值
  constructor({
    direction = new THREE.Vector3(1, 0, 0),
    intensity = new THREE.Vector3(1, 1, 1),
    spread = new THREE.Vector3(0, 0, 0),
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction;
    this.intensity = intensity instanceof THREE.Vector3 ? intensity : new THREE.Vector3(intensity, intensity, intensity);
    this.spread = spread instanceof THREE.Vector3 ? spread : new THREE.Vector3(spread, spread, spread);
    this.type = 'Wind';
  }

  effect(particle: ParticleInterface, emitter): void {
    super.effect(particle, emitter);
    const x: number = (this.direction.x + THREE.Math.randFloatSpread(this.spread.x)) * this.intensity.x;
    const y: number = (this.direction.y + THREE.Math.randFloatSpread(this.spread.y)) * this.intensity.y;
    const z: number = (this.direction.z + THREE.Math.randFloatSpread(this.spread.z)) * this.intensity.z;
    particle.velocity = particle.direction.multiplyScalar(particle.velocity).add(
      new THREE.Vector3(x, y, z)
    ).length();
    // 如果速度等于 0，直接返回，除数不能为 0
    if (particle.velocity === 0) return;
    particle.direction.divideScalar(particle.velocity); // 单位向量化
  }
}

export default Wind;
