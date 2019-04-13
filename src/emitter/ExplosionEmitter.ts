import * as THREE from 'three';
import Emitter from './Emitter';
import Line from '../particle/Line';
import { ParticleInterface } from '../particle/Particle';

// 爆炸发射器
// 发射类型固定位一个点
class ExplosionEmitter extends Emitter {
  constructor({ ...options } = {}) {
    super(options || {});
    this.type = 'ExplosionEmitter';
  }
  generate(): ParticleInterface[] {
    const generatedParticles: ParticleInterface[] = super.generate();
    const generatedParticlePosition: number[] = [this.anchor.x, this.anchor.y, this.anchor.z];
    for (let i: number = 0; i < generatedParticles.length; i++) {
      const generatedParticle: ParticleInterface = generatedParticles[i];
      switch (generatedParticle.type) {
        case Line.TYPE: {
          const line: Line = <unknown> generatedParticle as Line;
          const positionAttribute: THREE.BufferAttribute = line.geometry.getAttribute('position') as THREE.BufferAttribute;
          const positionArray: number[] = positionAttribute.array as number[];
          for (let m: number = 0; m < line.verticesNumber; m++) {
            for (let n: number = 0; n < line.verticesSize; n++) {
              const index = m * line.verticesSize + n; // 获得索引，避免重复计算
              positionArray[index] = index < line.vertices.length ?
                line.vertices[index] :
                generatedParticlePosition[n];
            }
          }
          positionAttribute.dynamic = true;
          positionAttribute.needsUpdate = true;
          break;
        }
        default: {
          generatedParticle.position.set(
            generatedParticlePosition[0],
            generatedParticlePosition[1],
            generatedParticlePosition[2]
          );
        }
      }
      generatedParticle.direction = new THREE.Vector3(
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
