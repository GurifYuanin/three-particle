import { ParticleInterface, Particle } from '../particle/Particle';

// 通用工具包
class Util {
  // 填充函数，用于将源头赋值给目标
  // 当目标是数组的时候，源头将同时赋值给数组内的每个元素
  static fill(target: any | any[], source: any, propertyName?: string): any {
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
    return target;
  }

  // threejs 对象清除函数
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

  // 深拷贝
  // 与一般深拷贝不同，该方法会优先认同传入对象的 clone 方法
  static clone(anything: any): any {
    if (anything && anything.clone) {
      return anything.clone();
    }
    if (Array.isArray(anything)) {
      const array = Array.from({ length: anything.length });
      for (let i: number = anything.length - 1; i >= 0; i--) {
        array[i] = Util.clone(anything[i]);
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