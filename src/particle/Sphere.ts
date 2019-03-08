import * as THREE from 'three';
import Particle from './Particle';

class Sphere extends Particle {
  radius: number;
  constructor({ radius = 50, material = new THREE.MeshPhongMaterial(), ...options } = {}) {
    const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
    super({ geometry, material, ...options });
    this.radius = radius;
  }
  clone(): Sphere | any {
    return new Sphere({
      radius: this.radius,
      material: new THREE.MeshPhongMaterial()
    });
  }

}
export default Sphere;
