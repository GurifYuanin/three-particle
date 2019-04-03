import * as THREE from 'three';

// 残影特效
class Afterimage {
  delay: number; // 残影延迟
  interval: number; // 残影间隙
  number: number; // 残影数量
  attenuation: number; // 每个残影的不透明度衰减量
  matrixWorlds: THREE.Matrix4[]; // 当残影类型不是 Line 时，保存的世界矩阵
  positionArrays: Array<number[]>; // 当残影的类型是 Line 时，保存的线段端点位置数组
  constructor({
    delay = 0.2,
    interval = 0.2,
    attenuation = 0.2,
    number = 2,
  } = {}) {
    this.delay = delay;
    this.interval = interval;
    this.number = number;
    this.attenuation = attenuation;
    this.matrixWorlds = [];
    this.positionArrays = [];
  }
  clone(): Afterimage {
    return new Afterimage({
      delay: this.delay,
      interval: this.interval,
      number: this.number,
      attenuation: this.attenuation
    });
  }
}

export default Afterimage;