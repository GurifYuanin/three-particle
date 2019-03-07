import * as THREE from 'three';
import Particle from '../particle/Particle';

export const getInterpolationFunction = (particlesTransformType) => {
  switch (particlesTransformType) {
    case Particle.TRANSFORM_LINEAR: return THREE.Math.lerp;
    case Particle.TRANSFORM_SMOOTH: return THREE.Math.smoothstep;
    case Particle.TRANSFORM_SMOOTHER: return THREE.Math.smootherstep;
    default: return () => 0;
  }
}