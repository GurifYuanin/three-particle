import * as THREE from 'three';
import { Particle } from './Particle';

/* 球 */
class Sphere extends THREE.Mesh {
  static readonly type: string = 'Sphere';
  radius: number;
  widthSegments: number;
  heightSegments: number;
  border: number;
  options: object;
  constructor({
    radius = 5,
    widthSegments = 32,
    heightSegments = 32,
    material = new THREE.MeshPhongMaterial() as THREE.Material,
    ...options
  } = {}) {
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.border = radius;
    this.options = options;
    this.type = 'Sphere';
  }
  clone(): Sphere | any {
    return new Sphere({
      radius: this.radius,
      heightSegments: this.heightSegments,
      widthSegments: this.widthSegments,
      material: (this.material as THREE.Material).clone(),
      ...this.options
    });
  }
}
export default Sphere;
