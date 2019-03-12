import Effect from './Effect';
import { ParticleInterface } from '../particle/Particle';

// 湍流
class Turbulent extends Effect {
  intensity: number;
  constructor({
    intensity = 10,
    ...options
  }) {
    super(options);
    this.intensity = 10;
  }
  effect(particle: ParticleInterface) {

  }
}

export default Turbulent;