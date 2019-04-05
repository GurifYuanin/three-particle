import * as THREE from 'three';
import { Particle } from './Particle';
import Glow from '../effect/Glow';

/* 球 */
class Sphere extends THREE.Mesh {
  static readonly TYPE: string = 'Sphere';
  radius: number; // 球半径
  widthSegments: number; // 横切数
  heightSegments: number; // 纵切数
  options: object;
  glow: Glow | null;
  constructor({
    radius = 5,
    widthSegments = 32,
    heightSegments = 32,
    glow = null,
    material = new THREE.MeshPhongMaterial(),
    ...options
  } = {}) {
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.options = options;
    this.glow = glow;
    // 设置 glow
    if (this.glow) {
      this.add(new THREE.Mesh(
        new THREE.SphereBufferGeometry(radius * this.glow.size, widthSegments, heightSegments),
        this.glow.getShaderMaterial()
      ));
    }
    this.type = 'Sphere';
  }
  clone(): Sphere | any {
    return new Sphere({
      radius: this.radius,
      heightSegments: this.heightSegments,
      widthSegments: this.widthSegments,
      material: (this.material as THREE.MeshPhongMaterial).clone(),
      glow: this.glow,
      ...this.options
    });
  }
}
export default Sphere;

