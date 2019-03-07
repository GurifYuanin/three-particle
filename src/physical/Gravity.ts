import Physical from './Physical';
import Particle from '../particle/Particle';

class Gravity extends Physical {
  gravity: number = 9.8;

  constructor() {
    super();
  }
  effect(particle: Particle) {
    super.effect(particle);

  }
}

export default Gravity;