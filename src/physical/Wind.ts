import * as THREE from 'three';
import Particle from '../particle/Particle';
import Physical from './Physical';

class Wind extends Physical {
  constructor({
    ...options
  }) {
    super(options);
  }

  effect(particle: Particle) {
    super.effect(particle);

  }
}

export default Wind;
