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
    /**
     * 已知平面法线 x1 y1 z1
     * 已知点 x2 y2 z2
     * radius 为 [0, emitter.radius]
     * 求 x y z
     *
     * 显然可得：
     * (x - x2, y - y2, z - z2) 垂直于 (x1, y1, z1)
     * (x - x2) * x1 + (y - y2) * y1 + (z - z2) * z1 = 0
     *
     * 化为等式：
     * (x - x2)^2 + (y - y2)^2 + (z - z2)^2 = radius^2
     * x1 * sqrt(radius^2 - (y - y2)^2 + (z - z2)^2) + (y - y2) * y1 + (z - z2) * z1 = 0
     * 
     * 但不知道如果解多项方程。。。
     */
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
