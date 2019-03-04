import * as THREE from 'three';
import Particle from './Particle';

class Sphere extends Particle {
  radius: number;
  constructor({ radius = 5, ...options }) {
    const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({});
    super({ geometry, material, ...options });
    this.radius = radius;
  }
}
export default Sphere;
