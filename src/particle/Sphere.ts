import * as THREE from 'three';
import Particle from './Particle';

class Sphere extends THREE.Mesh {
  radius: number;
  constructor(options) {
    const { radius } = options;
    super(new THREE.SphereBufferGeometry(radius, 32, 32), new THREE.MeshBasicMaterial({}));
    this.radius = radius;
  }
}
export default Sphere;