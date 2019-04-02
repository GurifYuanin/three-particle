import * as THREE from 'three';
import { ParticleInterface, Particle } from '../particle/Particle';

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
  static dispose(object: any): void {
    if (object.dispose) {
      object.dispose();
    }
    if (object instanceof Particle) {
      (object as ParticleInterface).geometry.dispose();
      (object as ParticleInterface).material.dispose();
    }
    if (Array.isArray(object.children)) {
      for (let i: number = object.children.length - 1; i >= 0; i--) {
        Util.dispose(object.children[i]);
      }
    }
    object = null;
  }
}

export default Util;