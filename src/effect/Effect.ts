import { ParticleInterface } from '../particle/Particle';

class Effect {
  type: string;
  constructor(options) {
    this.type = 'Effect';
  }
  effect(particle: ParticleInterface) {

  }
}

export default Effect;