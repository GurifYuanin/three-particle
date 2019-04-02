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

  static clone(anything: any): any {
    // deep clone
    if (anything && anything.clone) {
      return anything.clone();
    }
    if (Array.isArray(anything)) {
      const array = [];
      for (let thing of anything) {
        array.push(Util.clone(thing));
      }
      return array;
    } else if (Object.prototype.toString.call(anything).toLowerCase() === '[object object]') {
      const object = {};
      for (let key in anything) {
        Object.assign(object, {
          [key]: Util.clone(object[key])
        });
      }
      return object;
    } else {
      return anything;
    }
  }
}

export default Util;