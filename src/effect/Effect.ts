import { ParticleInterface } from '../particle/Particle';
import Emitter from '../emitter/Emitter';

class Effect {
  type: string;
  constructor(options = {}) {
    this.type = 'Effect';
  }
  effect(particle: ParticleInterface, emitter: Emitter) {

  }
}

export default Effect;