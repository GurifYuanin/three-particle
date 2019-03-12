import * as THREE from 'three';
import { Particle } from './Particle';

class Text extends THREE.Mesh {
  static readonly type: string = 'Text';
  constructor({
    text = 'hello world',
    font = '',
    ...options
  }) {
    super();
    Particle.prototype.constructor.call(this, options);
    this.type = 'Text';
  }
}


export default Text;