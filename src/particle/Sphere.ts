import * as THREE from 'three';
import { Particle } from './Particle';

class Sphere extends THREE.Mesh {
  static readonly type: string = 'Sphere';
  radius: number;
  constructor({ radius = 50, ...options } = {}) {
    const material = new THREE.MeshPhongMaterial();
    const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.radius = radius;
    this.type = 'Sphere';
  }
  clone(): Sphere | any {
    return new Sphere({
      radius: this.radius,
    });
  }
}
export default Sphere;
