import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';
import Line from '../particle/Line';
import * as THREE from 'three';

class DirectionEmitter extends Emitter {
  static readonly EMIT_TYPE_SHPERE: number = 0; // 球形发射
  static readonly EMIT_TYPE_ROUND:  number = 1; // 圆形发射
  direction: THREE.Vector3; // 方向
  emitType: number; // 发射类型
  radius: THREE.Vector3;
  spread: THREE.Vector3; // 粒子发散值
  constructor({
    direction = new THREE.Vector3(0, 0, -1),
    spread = new THREE.Vector3(0, 0, 0),
    radius = new THREE.Vector3(0, 0, 0),
    emitType = DirectionEmitter.EMIT_TYPE_SHPERE,
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction.normalize();
    this.spread = spread instanceof THREE.Vector3 ? spread : new THREE.Vector3(spread, spread, spread);
    this.radius = radius instanceof THREE.Vector3 ? radius : new THREE.Vector3(radius, radius, radius);
    this.emitType = emitType;
    this.type = 'DirectionEmitter';

    if (this.emitType === DirectionEmitter.EMIT_TYPE_ROUND) {
      // 解决方案二
      // 旋转整个发射器
      // this.lookAt(this.direction);
      // 旋转后将粒子发射方向进行修正
      // this.direction.applyEuler(this.rotation);
      // this.direction.negate();
      // 设置拦截器，因为此时发射器方向发生变化，
      // 这里暂时将 anchor 的变更拦截到 position 上
      this.anchor = new Proxy(this.anchor, {
        get: (target: THREE.Vector3, key: string) => target[key],
        set: (target: THREE.Vector3, key: string, value: number) => {
          this.position[key] = value;
          return Boolean(value);
        }
      });
    }
  }
  generate(): ParticleInterface[] {
    const baseVector3: THREE.Vector3 = new THREE.Vector3(0, 0, 1); // 将粒子放在 x-y 平面上
    const angle: number = this.direction.angleTo(baseVector3); // 发生器发射方向和 x-y 平面的夹角
    const axis: THREE.Vector3 = baseVector3.cross(this.direction); // 垂直于 direction 和 baseVector3 的法线

    const generatedParticles: ParticleInterface[] = super.generate();
    for (let i: number = 0; i < generatedParticles.length; i++) {
      const generatedParticle: ParticleInterface = generatedParticles[i];

      // 初始化粒子位置
      // 设置为数组而不是 THREE.Vector3 是为了方便在循环体内操作
      // 默认情况设置为球形
      const generatedParticlePosition: number[] = [
        this.anchor.x + THREE.Math.randFloatSpread(this.radius.x),
        this.anchor.y + THREE.Math.randFloatSpread(this.radius.y),
        this.anchor.z + THREE.Math.randFloatSpread(this.radius.z) 
      ];

      switch(this.emitType) {
        case DirectionEmitter.EMIT_TYPE_SHPERE: {
          // 发射类型为球形
          break;
        }
        case DirectionEmitter.EMIT_TYPE_ROUND: {
          // 发射类型为圆形

          // 解决方案一
          /**
          * 已知平面法线 x1 y1 z1
          * 已知发射器 anchor 为 x2 y2 z2
          * radius 为 [0, emitter.radius] 之间的一个随机值
          * 求 x y z
          *
          * 显然可得：
          * (x - x2, y - y2, z - z2) 垂直于 (x1, y1, z1)
          * (x - x2) * x1 + (y - y2) * y1 + (z - z2) * z1 = 0
          *
          * 化为等式：
          * (x - x2)^2 + (y - y2)^2 + (z - z2)^2 = radius^2
          * x1 * sqrt(radius^2 - (y - y2)^2 + (z - z2)^2) + (y - y2) * y1 + (z - z2) * z1 = 0
          * 
          * 但不知道如果解多项方程。。。
          */
          
          // 解决方案二
          // 变用另一种实现方式
          // 在 x-y 面上生成粒子
          // 再旋转发射器，使其朝向发射器的 direction
          // 但直接变化了发射器的 localMatrix，anchor、physic、effect 都将受到影响

          // 解决方案三
          // 类似于解决方案二
          // 但旋转每个粒子
          // 缺陷是影响发射器的 anchor 设置
          // 
          const generatedParticleVector = new THREE.Vector3(
            generatedParticlePosition[0],
            generatedParticlePosition[1],
            this.anchor.z
          );
          generatedParticleVector.applyAxisAngle(axis, angle);
          generatedParticlePosition[0] = generatedParticleVector.x;
          generatedParticlePosition[1] = generatedParticleVector.y;
          generatedParticlePosition[2] = generatedParticleVector.z;
          break;
        }
        default: {
          // 默认情况
        }
      }

      switch (generatedParticle.type) {
        case Line.TYPE: {
          // 对于线段来说，position 属性并不生效
          // 生效的是 geometry.getAttribute('position')
          const line: Line = <unknown>generatedParticle as Line;
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
          // 默认情况。粒子的 position 决定粒子的位置
          // 已经设置完成，无需修改
        }
      }

      generatedParticle.position.set(
        generatedParticlePosition[0],
        generatedParticlePosition[1],
        generatedParticlePosition[2],
      );

      // 初始化粒子方向
      generatedParticles[i].direction = new THREE.Vector3(
        this.direction.x + THREE.Math.randFloatSpread(this.spread.x),
        this.direction.y + THREE.Math.randFloatSpread(this.spread.y),
        this.direction.z + THREE.Math.randFloatSpread(this.spread.z),
      ).normalize();
    }

    return generatedParticles;
  }
  update(): void {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clearAll();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default DirectionEmitter;
