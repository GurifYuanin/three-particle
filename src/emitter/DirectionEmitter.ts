import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';
import * as THREE from 'three';

class DirectionEmitter extends Emitter {
  direction: THREE.Vector3; // 方向
  emitType: number; // 发射类型
  spread: number; // 粒子发散值
  constructor({
    direction = new THREE.Vector3(0, 0, -1),
    spread = 10,
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction.normalize();
    this.spread = spread;
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
    }
    return generatedParticles;
  }
  update(): void {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clearAll();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default DirectionEmitter;
