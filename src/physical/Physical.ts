import { ParticleInterface } from '../particle/Particle';
import Emitter from '../emitter/Emitter';

class Physcial {
  type: string;
  constructor(options = {}) {
    this.type = 'Physcial';
  }
  effect(particle: ParticleInterface, emitter: Emitter): void {

  }
}

export default Physcial;
