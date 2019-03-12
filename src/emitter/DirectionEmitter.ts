import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';
import * as THREE from 'three';

class DirectionEmitter extends Emitter {
  direction: THREE.Vector3; // 方向
  flat: THREE.Vector3[]; // 粒子发射起始点平面
  isFlat: boolean;
  spread: number; // 粒子发散值
  constructor({
    direction = new THREE.Vector3(0, 0, -1),
    flat = [],
    spread = 10,
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction.normalize();
    this.spread = spread;
    this.flat = flat;
    this.isFlat = flat.length > 0;
    this.type = 'DirectionEmitter';
  }
  generate(): ParticleInterface[] {
    const generatedParticles: ParticleInterface[] = super.generate();
    for (let i: number = 0; i < generatedParticles.length; i++) {
      generatedParticles[i].direction = new THREE.Vector3(
        this.direction.x * this.spread + THREE.Math.randFloatSpread(this.spread),
        this.direction.y * this.spread + THREE.Math.randFloatSpread(this.spread),
        this.direction.z * this.spread + THREE.Math.randFloatSpread(this.spread),
      ).normalize();
      if (this.isFlat) {
        const end: THREE.Vector3 = this.flat[THREE.Math.randInt(0, this.flat.length - 1)];
        generatedParticles[i].position.set(
          THREE.Math.randFloat(end.x, this.anchor.x),
          THREE.Math.randFloat(end.y, this.anchor.y),
          THREE.Math.randFloat(end.z, this.anchor.z),
        );
      }
    }
    return generatedParticles;
  }
  update(): void {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clear();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default DirectionEmitter;
