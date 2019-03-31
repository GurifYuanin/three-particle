import * as THREE from 'three';
import { Particle } from '../particle/Particle';

class Lut {
  // 获得插值方程
  static getInterpolationFunction(particlesTransformType: number): (x: number, y: number, t: number) => number {
    switch (particlesTransformType) {
      case Particle.TRANSFORM_LINEAR: return THREE.Math.lerp;
      case Particle.TRANSFORM_SMOOTH: return THREE.Math.smoothstep;
      case Particle.TRANSFORM_SMOOTHER: return THREE.Math.smootherstep;
      default: return () => 0;
    }
  }
}

export default Lut;