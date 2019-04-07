import * as THREE from 'three';
import { Particle } from '../particle/Particle';

class Lut {
  // 根据值，获得最小值到最大值之间的百分比位置
  static getInterpolationFunction(particlesTransformType: number): (value: number, min: number, max: number) => number {
    switch (particlesTransformType) {
      case Particle.TRANSFORM_LINEAR: return (value: number, min: number, max: number) => (value - min) / (max - min);
      case Particle.TRANSFORM_SMOOTH: return THREE.Math.smoothstep;
      case Particle.TRANSFORM_SMOOTHER: return THREE.Math.smootherstep;
      default: return () => 0;
    }
  }
}

export default Lut;