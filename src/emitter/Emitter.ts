import Particle from '../particle/Particle';
import * as THREE from 'three';

class Emitter extends THREE.Group {
  type: string;
  emmitNumberPerSecond: number;
  constructor({ emmitNumberPerSecond = 100 }) {
    super();
    this.emmitNumberPerSecond = emmitNumberPerSecond;
    this.type = 'Emitter';
  }
  update() {}
}

export default Emitter;
