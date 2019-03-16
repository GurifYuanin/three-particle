import * as THREE from 'three';
import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';

class ExplosionEmitter extends Emitter {
  constructor({ ...options } = {}) {
    super(options || {});
  }
  generate(): ParticleInterface[] {
    const generatedParticles: ParticleInterface[] = super.generate();
    for (let i = 0; i < generatedParticles.length; i++) {
      generatedParticles[i].direction = new THREE.Vector3(
        THREE.Math.randFloatSpread(1),
        THREE.Math.randFloatSpread(1),
        THREE.Math.randFloatSpread(1)
      ).normalize();
    }
    return generatedParticles;
  }

  update() {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clearAll();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default ExplosionEmitter;
