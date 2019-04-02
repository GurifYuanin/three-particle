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
    material = new THREE.MeshPhongMaterial() as THREE.Material,
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
        new THREE.SphereBufferGeometry(radius * this.glow.rate, widthSegments, heightSegments),
        new THREE.ShaderMaterial({
          uniforms: { 
            'scale': { type: 'f', value: this.glow.scale},
            'basic': { type: 'f', value: this.glow.basic},
            'power': { type: 'f', value: this.glow.power },
            color: { type: 'c', value: this.glow.color }
          },
          opacity: .5,
          vertexShader: Glow.vertexShader,
          fragmentShader: Glow.fragmentShader,
          side: THREE.FrontSide,
          blending: THREE.AdditiveBlending,
          transparent: true
        })
      ));
    }
    this.type = 'Sphere';
  }
  clone(): Sphere | any {
    const sphere = new Sphere({
      radius: this.radius,
      heightSegments: this.heightSegments,
      widthSegments: this.widthSegments,
      material: (this.material as THREE.Material).clone(),
      glow: this.glow,
      ...this.options
    });

    return sphere;
  }
}
export default Sphere;

