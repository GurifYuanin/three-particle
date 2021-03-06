import * as THREE from 'three';
import Effect from './Effect';
import { ParticleInterface } from '../particle/Particle';
import Line from '../particle/Line';
import Points from '../particle/Points';
import Emitter from '../emitter/Emitter';

// 湍流
class Turbulent extends Effect {
  intensity: number;
  constructor({
    intensity = 10,
    ...options
  } = {}) {
    super(options || {});
    this.intensity = intensity;
    this.type = 'Turbulent';
  }
  effect(particle: ParticleInterface, emitter: Emitter): void {
    switch (particle.type) {
      case Line.TYPE: ;
      case Points.TYPE: {
        // 扰乱折线或者点集各个点的位置
        // 而不是影响粒子位置
        // 因为 particle.position 是整个粒子的位置属性
        const positionAttribute: THREE.BufferAttribute = (particle.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
        const positionArray: number[] = positionAttribute.array as number[];
        for (let i: number = positionArray.length - 1; i >= 0; i--) {
          positionArray[i] += THREE.Math.randFloatSpread(this.intensity);
        }
        positionAttribute.needsUpdate = true;
        break;
      }
      default: {
        particle.position.addScalar(THREE.Math.randFloatSpread(this.intensity));
      }
    }
  }
}

export default Turbulent;