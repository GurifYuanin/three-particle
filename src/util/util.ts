import { ParticleInterface } from '../particle/Particle';

// 通用工具包
class Util {
  static fill(target: any | any[], source: any, propertyName?: string): void {
    if (Array.isArray(target)) {
      for (let i: number = target.length - 1; i >= 0; i--) {
        if (propertyName) {
          target[i][propertyName] = source;
        } else {
          target[i] = source;
        }
      }
    } else {
      if (propertyName) {
        target[propertyName] = source;
      } else {
        target = source;
      }
    }
  }
  static dispose(particle: ParticleInterface): void {
    particle.geometry.dispose();
    particle.material.dispose();
    particle = null;
  }
}

export default Util;