import * as THREE from 'three';
import { ParticleInterface } from '../particle/Particle';
import Physical from './Physical';

class Wind extends Physical {
  direction: THREE.Vector3; // 风方向
  intensity: number; // 风力
  spread: number; // 风发散值
  constructor({

    ...options
  }) {
    super(options);
  }

  effect(particle: ParticleInterface) {
    super.effect(particle);
  }
}

export default Wind;
