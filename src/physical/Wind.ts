import * as THREE from 'three';
import { ParticleInterface } from '../particle/Particle';
import Physical from './Physical';

class Wind extends Physical {
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
