import { ParticleInterface } from '../particle/Particle';

class Physcial {
  type: string;
  constructor(options = {}) {
    this.type = 'Physcial';
  }
  effect(particle: ParticleInterface): void {

  }
}

export default Physcial;
