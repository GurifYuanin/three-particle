import * as THREE from 'three';
import { ParticleInterface } from '../particle/Particle';
import Physical from '../physical/Physical';
import Points from '../particle/Points';
import Line from '../particle/Line';
import Util from '../util/Util';
import Effect from '../effect/Effect';
import Event from '../event/Event';

class Emitter extends THREE.Object3D {
  static readonly MODE_DURATIOIN: number = 0; // 持续发射
  static readonly MODE_EXPLOSION: number = 1; // 爆炸失发射
  
  static readonly TRANSFORM_LINEAR: number = 0; // 线性插值
  static readonly TRANSFORM_SMOOTH: number = 1; // 平滑插值
  static readonly TRANSFORM_SMOOTHER: number = 2; // 更平滑的插值

  static readonly STATUS_NORMAL: number = 0;
  static readonly STATUS_STOP: number = 1;
  static readonly STATUS_FROZEN: number = 2;

  emission: number; // 每秒发射的粒子数
  status: number; // 是否发射粒子中
  clock: THREE.Clock; // 生命时钟
  anchor: THREE.Vector3; // 粒子发射原点
  particles: ParticleInterface[]; // 发射粒子样板
  physicals: Physical[]; // 物理场
  effects: Effect[]; // 特效场
  events: Event[]; // 事件
  isVerticalToDirection: boolean; // 粒子朝向是否垂直于运动方向
  mode: number; // 发射模式
  particlesPositionRandom: THREE.Vector3; // 粒子位置随机数
  particlesOpacityRandom: number; // 粒子透明度随机数
  particlesOpacityKey: number[]; // 一个生命周期内，粒子透明度关键帧百分比
  particlesOpacityValue: number[]; // 一个生命周期内，粒子透明度关键帧透明度值
  particlesColorRandom: THREE.Color; // 粒子颜色随机数
  particlesColorKey: number[]; // 一个生命周期内，粒子颜色关键帧百分比
  particlesColorValue: THREE.Color[]; // 一个生命周期内，粒子颜色关键帧颜色值
  particlesRotationRandom: THREE.Vector3; // 粒子旋转随机值
  particlesRotationKey: number[]; // 一个生命周期内，粒子旋转关键帧百分比
  particlesRotationValue: THREE.Vector3[]; // 一个生命周期内，粒子旋转关键帧旋转值
  particlesScaleRandom: THREE.Vector3; // 粒子缩放随机数
  particlesScaleKey: number[]; // 一个生命周期内，粒子缩放关键帧百分比
  particlesScaleValue: THREE.Vector3[]; // 一个生命周期内，粒子缩放关键帧缩放值
  particlesTransformType: number; // 粒子关键帧之间的差值方式
  type: string;
  // 发射器 update 时间差太小，导致发射 0 粒子，
  // 统计这些时间差，将其累加起来
  gap: number;

  constructor({
    emission = 100,
    status = Emitter.STATUS_NORMAL,
    isVerticalToDirection = false,
    mode = Emitter.MODE_DURATIOIN,
    anchor = new THREE.Vector3(0, 0, 0),
    particlesPositionRandom = new THREE.Vector3(0, 0, 0),
    particlesOpacityRandom = 0,
    particlesOpacityKey = [],
    particlesOpacityValue = [],
    particlesColorRandom = new THREE.Color(0, 0, 0),
    particlesColorKey = [],
    particlesColorValue = [],
    particlesRotationRandom = new THREE.Vector3(0, 0, 0),
    particlesRotationKey = [],
    particlesRotationValue = [],
    particlesScaleRandom = new THREE.Vector3(0, 0, 0),
    particlesScaleKey = [],
    particlesScaleValue = []
  } = {}) {
    super();
    this.emission = emission;
    this.isVerticalToDirection = isVerticalToDirection;
    this.mode = mode;
    this.status = status;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.particles = [];
    this.physicals = [];
    this.effects = [];
    this.events = [];
    this.anchor = anchor instanceof THREE.Vector3 ? anchor : new THREE.Vector3(anchor, anchor, anchor);
    this.particlesPositionRandom = particlesPositionRandom instanceof THREE.Vector3 ? particlesPositionRandom : new THREE.Vector3(particlesPositionRandom, particlesPositionRandom, particlesPositionRandom);
    this.particlesOpacityRandom = particlesOpacityRandom;
    this.particlesOpacityKey = particlesOpacityKey;
    this.particlesOpacityValue = particlesOpacityValue;
    this.particlesColorRandom = particlesColorRandom instanceof THREE.Color ? particlesColorRandom : new THREE.Color(particlesColorRandom, particlesColorRandom, particlesColorRandom);
    this.particlesColorKey = particlesColorKey;
    this.particlesColorValue = Util.isElementsInstanceOf(particlesColorValue, THREE.Color) ?
                               particlesColorValue :
                               particlesColorValue.map(color => {
                                 return color >= 0 && color <= 1 ?
                                        new THREE.Color(color, color, color) :
                                        new THREE.Color(color);
                               });
    this.particlesRotationRandom = particlesRotationRandom;
    this.particlesRotationKey = particlesRotationKey;
    this.particlesRotationValue = Util.isElementsInstanceOf(particlesRotationValue, THREE.Vector3) ?
                                  particlesRotationValue :
                                  particlesRotationValue.map(rotation => new THREE.Vector3(rotation, rotation, rotation));
    this.particlesScaleRandom = particlesScaleRandom instanceof THREE.Vector3 ? particlesScaleRandom : new THREE.Vector3(particlesScaleRandom, particlesScaleRandom, particlesScaleRandom);
    this.particlesScaleKey = particlesScaleKey;
    this.particlesScaleValue = Util.isElementsInstanceOf(particlesScaleValue, THREE.Vector3) ?
                               particlesScaleValue :
                               particlesScaleValue.map(scale => new THREE.Vector3(scale, scale, scale));
    this.particlesTransformType = Emitter.TRANSFORM_LINEAR;
    this.gap = 0;
    this.type = 'Emitter';
  }
  // 新增样板粒子
  addParticle(particle: ParticleInterface): void {
    this.particles.push(particle);
  }
  addParticles(particles: ParticleInterface[]): void {
    for (let i: number = 0; i < particles.length; i++) {
      this.addParticle(particles[i]);
    }
  }
  removeParticle(particle: ParticleInterface): ParticleInterface | null {
    const index: number = this.particles.indexOf(particle);
    return index === -1 ? null : this.particles.splice(index, 1)[0];
  }
  // 新增物理场
  addPhysical(physical: Physical): void {
    this.physicals.push(physical);
  }
  addPhysicals(physicals: Physical[]): void {
    for (let i: number = 0; i < physicals.length; i++) {
      this.physicals.push(physicals[i]);
    }
  }
  removePhysical(physical: Physical): Physical | null {
    const index: number = this.physicals.indexOf(physical);
    return index === -1 ? null : this.physicals.splice(index, 1)[0];
  }
  // 新增特效场
  addEffect(effect: Effect): void {
    this.effects.push(effect);
  }
  addEffects(effects: Effect[]): void {
    for (let i: number = 0; i < effects.length; i++) {
      this.effects.push(effects[i]);
    }
  }
  removeEffect(effect: Effect): Effect | null {
    const index: number = this.effects.indexOf(effect);
    return index === -1 ? null : this.effects.splice(index, 1)[0];
  }
  // 新增交互事件
  addEvent(event: Event): void {
    this.events.push(event);
  }
  addEvents(events: Event[]): void {
    for (let i: number = 0; i < events.length; i++) {
      this.events.push(events[i]);
    }
  }
  removeEvent(event: Event): Event | null {
    const index: number = this.events.indexOf(event);
    return index === -1 ? null : this.events.splice(index, 1)[0];
  }
  // 开始发射粒子，默认为开启
  start(): void {
    this.status = Emitter.STATUS_NORMAL;
  }
  // 暂停发射粒子
  stop(): void {
    this.status = Emitter.STATUS_STOP;
  }
  freeze(): void {
    this.status = Emitter.STATUS_FROZEN;
  }
  // 生成粒子
  generate(): ParticleInterface[] {
    // 发射器进行打点
    let delta: number = this.clock.getDelta(); // 距离上一次发射粒子过去的时间差
    let deltaEmission: number = 0; // 该时间差需要发射多少粒子
    const particlesNumber = this.particles.length;
    const generatedParticles: ParticleInterface[] = [];

    // 当发射器处于发射状态，且粒子样本数量大于 0 时，才会进行粒子创建
    if (this.status === Emitter.STATUS_NORMAL && particlesNumber > 0) {
      switch(this.mode) {
        case Emitter.MODE_DURATIOIN: {
          // 持续发射模式
          // 通过打点时间差计算得到本次 update 需要补充多少粒子
          deltaEmission = Math.floor((delta + this.gap) * this.emission);
          if (deltaEmission === 0) {
            // 应该发射粒子数量为 0，且已发射的例子数量过少
            // 出现这种情况是因为每次发射器 update 消耗时间过小
            // 进而导致 delta 过小，计算出来的 deltaEmission 为 0
            this.gap += delta;
          } else {
            // 计算出来应发射粒子数大于 0
            // 属于正常情况，所以清空 gap
            this.gap = 0;
          }
          break;
        }
        case Emitter.MODE_EXPLOSION: {
          // 爆炸式发射模式
          // 当粒子全部清除干净的时候一次性发射所有粒子
          if (this.children.length === 0) {
            deltaEmission = this.emission;
          }
          break;
        }
        default: {
          // 默认模式
        }
      }

      // 新增粒子
      // 基类 Emitter 不会初始化粒子的位置和方向等参数，
      // 只会负责生成例子，而由子类来实现粒子的参数
      for (let i: number = 0; i < deltaEmission; i++) {
        const randomParticle: ParticleInterface = this.particles[THREE.Math.randInt(0, particlesNumber - 1)]; // 从 particles 内随机取出一个粒子作为样本
        randomParticle.onBeforeCreated(); // 调用生命周期钩子
        const generatedRandomParticle: ParticleInterface = randomParticle.clone();
        generatedRandomParticle.matrixAutoUpdate = false; // 为了提高效率，在这里关闭 matrix 的自动更新，手动控制更新时机
        generatedRandomParticle.onAfterCreated(); // 调用生命周期钩子
        if (generatedRandomParticle.emitting) {
          // 外层会进行一次 emitting 判断，控制发射器是否可以发射粒子
          // 这里也会进行一次判断，判断该粒子是否可以被发射器发射
          // 这里是因为 Text 粒子需要加载字体
          // 字体未加载完成之前不能添加到场景中
          // 用粒子的 emitting 属性标记是否可以进行发射
          generatedParticles.push(generatedRandomParticle);
          this.add(generatedRandomParticle);
        } else {
          // 粒子无法进行发射，则清除掉
          Util.dispose(generatedRandomParticle);
        }
      }
    }
    // 返回生成的粒子，用于在子类内进行二次修改
    return generatedParticles;
  }
  // 更新粒子
  update(): void {
    if (this.status === Emitter.STATUS_FROZEN) return;

    // 触发事件
    // 在更新方法前面部分判定触发，因为关闭了粒子的矩阵自动计算
    for (let i: number = 0; i < this.events.length; i++) {
      this.events[i].effect(this.children as ParticleInterface[], this);
    }
    
    for (let i: number = this.children.length - 1; i >= 0; i--) {
      const particle: ParticleInterface = this.children[i] as ParticleInterface;
      if (!particle.emitting) continue;
      // 粒子从出生到现在所经过的时间（单位：秒）
      const elapsedTime: number = particle.clock.elapsedTime;
      // 获得粒子距离上次更新的时间差
      const elapsedTimePercentage: number = elapsedTime % particle.life / particle.life;
      // 获得查询百分比函数
      const interpolationFunction: (value: number, min: number, max: number) => number = Emitter.getInterpolationFunction(this.particlesTransformType);

      // 设置粒子属性随机值
      // 粒子透明度
      for (let j: number = 0; j < this.particlesOpacityKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
          const opacityPercentage: number = interpolationFunction(elapsedTimePercentage,
                                            this.particlesOpacityKey[j],
                                            this.particlesOpacityKey[j + 1]);
          particle.material.opacity = THREE.Math.lerp(
            this.particlesOpacityValue[j],
            this.particlesOpacityValue[j + 1],
            opacityPercentage
          ) + THREE.Math.randFloatSpread(this.particlesOpacityRandom);
          break;
        }
      }
      
      // 粒子颜色
      for (let j: number = 0; j < this.particlesColorKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
          const preColor: THREE.Color = this.particlesColorValue[j];
          const nextColor: THREE.Color = this.particlesColorValue[j + 1];
          const colorPercentage: number = interpolationFunction(elapsedTimePercentage,
                                          this.particlesColorKey[j],
                                          this.particlesColorKey[j + 1]);
          particle.material.color = new THREE.Color(
            THREE.Math.lerp(preColor.r, nextColor.r, colorPercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom.r),
            THREE.Math.lerp(preColor.g, nextColor.g, colorPercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom.g),
            THREE.Math.lerp(preColor.b, nextColor.b, colorPercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom.b),
          )
          break;
        }
      }
      
      // 粒子位置
      if (this.particlesPositionRandom) {
        particle.position.add(new THREE.Vector3(
          THREE.Math.randFloatSpread(this.particlesPositionRandom.x),
          THREE.Math.randFloatSpread(this.particlesPositionRandom.y),
          THREE.Math.randFloatSpread(this.particlesPositionRandom.z),
        ));
      }

      // 粒子旋转
      for (let j: number = 0; j < this.particlesRotationKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesRotationKey[j] && elapsedTimePercentage < this.particlesRotationKey[j + 1]) {
          const preRotation: THREE.Vector3 = this.particlesRotationValue[j];
          const nextRotation: THREE.Vector3 = this.particlesRotationValue[j + 1];
          const rotationPercentage: number = interpolationFunction(elapsedTimePercentage,
                                             this.particlesRotationKey[j],
                                             this.particlesRotationKey[j + 1]);
          particle.rotateX(THREE.Math.lerp(preRotation.x, nextRotation.x, rotationPercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.x));
          particle.rotateY(THREE.Math.lerp(preRotation.y, nextRotation.y, rotationPercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.y));
          particle.rotateZ(THREE.Math.lerp(preRotation.z, nextRotation.z, rotationPercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.z));
          break;
        }
      }

      // 粒子缩放
      for (let j: number = 0; j < this.particlesScaleKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesScaleKey[j] && elapsedTimePercentage < this.particlesScaleKey[j + 1]) {
          const preScale: THREE.Vector3 = this.particlesScaleValue[j];
          const nextScale: THREE.Vector3 = this.particlesScaleValue[j + 1];
          const scalePercentage: number = interpolationFunction(elapsedTimePercentage,
                                          this.particlesScaleKey[j],
                                          this.particlesScaleKey[j + 1]);
          // 缩放值不应该为 0 ,否则 three 无法计算 Matrix3 的逆，控制台报警告
          // https://github.com/aframevr/aframe-inspector/issues/524
          particle.scale.set(
            (THREE.Math.lerp(preScale.x, nextScale.x, scalePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.x)) || 0.00001,
            (THREE.Math.lerp(preScale.y, nextScale.y, scalePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.y)) || 0.00001,
            (THREE.Math.lerp(preScale.z, nextScale.z, scalePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.z)) || 0.00001
          );
          break;
        }
      }

      // 特效场影响
      for (let j: number = 0; j < this.effects.length; j++) {
        this.effects[j].effect(particle, this);
      }

      // 物理场影响
      for (let j: number = 0; j < this.physicals.length; j++) {
        this.physicals[j].effect(particle, this);
      }

      // 进行移动
      switch (particle.type) {
        case Line.TYPE: {
          // 线段的运动是最前面的点更新值
          // 其后的所有点紧随前面一个的点的位置
          const line: Line = <unknown>particle as Line;
          const positionAttribute: THREE.BufferAttribute = line.geometry.getAttribute('position') as THREE.BufferAttribute;
          const positionArray: number[] = positionAttribute.array as number[];
          const verticesNumber: number = line.verticesNumber;
          const verticesSize: number = line.verticesSize;
          let m: number, n: number;
          // 更新除了第一个点之外的所有点
          for (m = 0; m < verticesNumber - 1; m++) {
            for (n = 0; n < verticesSize; n++) {
              positionArray[m * verticesSize + n] = positionArray[(m + 1) * verticesSize + n];
            }
          }
          // 更新第一个点
          const directionArray: number[] = [particle.direction.x, particle.direction.y, particle.direction.z];
          for (n = 0; n < verticesSize; n++) {
            positionArray[m * verticesSize + n] += directionArray[n] * particle.velocity;
          }
          positionAttribute.needsUpdate = true;
          break;
        }
        default: {
          particle.position.addScaledVector(particle.direction, particle.velocity);
        }
      }
      
      // 粒子朝向
      if (this.isVerticalToDirection) {
        // 修改粒子朝向，使其垂直于运动方向
        const angle: number = particle.up.angleTo(particle.direction) + 1.5707963267948966; // 1.57 即 90deg
        const axis: THREE.Vector3 = particle.direction.clone().cross(particle.up);
        particle.setRotationFromAxisAngle(axis, angle);
      }

      // 生成与更新残影
      if (particle.afterimage && particle.afterimage.number > 0) {
        const isLine: boolean = particle.type === Line.TYPE; // 当粒子类型是线段时，有另一套处理方法

        if (elapsedTime > particle.afterimage.delay - particle.afterimage.interval) {
          if (isLine) {
            // 当粒子类型是线段时，直接将每个端点的位置复制下来
            const positionArray: number[] | ArrayLike<number> = (particle.geometry as THREE.BufferGeometry).getAttribute('position').array;
            const cloneArray: number[] = Array.from({ length: positionArray.length });
            for (let j: number = 0; j < positionArray.length; j++) {
              cloneArray[j] = positionArray[j];
            }
            particle.afterimage.positionArrays.push(cloneArray);
          } else {
            // 将粒子的世界矩阵记录下来，作为残影的运动轨迹
            particle.afterimage.matrixWorlds.push(particle.matrixWorld.clone());
          }
        }

        if (elapsedTime > particle.afterimage.delay) {
          // 先计算还需要生成的残影的数量
          // 用总共需要生成的残影数量减去已经生成的残影数量
          // 点集的发光特效与其他粒子不同，是通过 material.map 来实现，因此不会添加进 children 数组内
          const generatedGlowNumber: number = (particle.glow && particle.type !== Points.TYPE) ? 1 : 0;
          const generatedAfterimageNumber: number = particle.children.length - generatedGlowNumber; // 已经生成的残影数量
          const needGeneratedAfterimageNumber: number =
            Math.min(Math.floor((elapsedTime - particle.afterimage.delay) / particle.afterimage.interval) + 1, particle.afterimage.number)
            - generatedAfterimageNumber;
          // 生成新的残影粒子
          for (let j: number = 0; j < needGeneratedAfterimageNumber; j++) {
            const afterimageParticle: ParticleInterface = particle.clone();
            Util.dispose(afterimageParticle.children.splice(generatedGlowNumber)); // 只保留残影子物体中的发光物体就行
            // 残影形变（位置、缩放、旋转）直接设置，不需要通过 position scale rotation 计算
            // afterimageParticle.matrixWorldNeedsUpdate = false;
            afterimageParticle.matrixAutoUpdate = false;
            // 设置残影的不透明度
            afterimageParticle.material.transparent = true;
            afterimageParticle.material.opacity = Math.max(0, particle.material.opacity - particle.afterimage.attenuation * (j + 1 + generatedAfterimageNumber));
            particle.add(afterimageParticle);
          }

          // 更新残影粒子位置
          if (isLine) {
            for (let j: number = particle.children.length - 1; j >= generatedGlowNumber; j--) {
              const afterimageParticle: (Line & ParticleInterface) = particle.children[j] as (Line & ParticleInterface);
              const afterimageParticlePositionAttribute: THREE.BufferAttribute = afterimageParticle.geometry.getAttribute('position') as THREE.BufferAttribute;
              const afterimageParticlePositionArray: number[] = afterimageParticlePositionAttribute.array as number[];
              const positionArray: number[] = particle.afterimage.positionArrays[afterimageParticle.afterimagePositionArrayIndex]; 
              for (let m: number = 0; m < afterimageParticle.verticesNumber; m++) {
                for (let n: number = 0; n < afterimageParticle.verticesSize; n++) {
                  const index: number = m * afterimageParticle.verticesSize + n;
                  afterimageParticlePositionArray[index] = positionArray[index];
                }
              }
              afterimageParticlePositionAttribute.needsUpdate = true;
              afterimageParticle.afterimagePositionArrayIndex++;
            }
          } else {
            // 无法直接设置残影粒子的世界矩阵，只能通过设置本地矩阵后与父物体的世界矩阵相乘得到
            // matrix 代表物体的形变，matrixWorld 表示自身形变加上父物体形变的最终结果
            // matrix * parent.matrixWorld = matrixWorld
            // => matrix = matrixWorld * (parent.matrixWorld 的逆矩阵)
            // 表示意义为：残影此刻的本地矩阵 * 父物体此刻的世界矩阵 = 若干秒前物体的世界矩阵
            // "父物体此刻的世界矩阵" 和 "若干秒前物体的世界矩阵" 已知，便可求物体当前时刻的本地矩阵
            for (let j: number = particle.children.length - 1; j >= generatedGlowNumber; j--) {
              const afterimageParticle: ParticleInterface = particle.children[j] as ParticleInterface;
              afterimageParticle.matrix.copy(
                particle.afterimage.matrixWorlds[afterimageParticle.afterimageMatrixWorldIndex].clone()
                  .multiply(new THREE.Matrix4().getInverse(particle.matrixWorld))
              );
              afterimageParticle.afterimageMatrixWorldIndex++; // 残影行迹轨迹向前一步
            }
          }
        }
      }
      particle.material.needsUpdate = true;
      particle.updateMatrix(); // 粒子形变处理完成，更新 matrix
    }
  }
  clear(particle: ParticleInterface): void {
    // 清除指定的粒子
    particle.onBeforeDestroyed();
    this.remove(particle);
    particle.onAfterDestroyed();
    Util.dispose(particle);
  }
  clearAll(): void {
    // 清除生命周期已经结束的粒子
    for (let i: number = this.children.length - 1; i >= 0; i--) {
      const particle: ParticleInterface = this.children[i] as ParticleInterface;
      if (particle.clock.getElapsedTime() > particle.life) {
        // 这里调用了 getElapsedTime() ，将进行一次时间的打点
        // 后续直接使用 elapsedTime 而不需要再次调用该方法
        this.clear(particle);
      }
    }
  }

  // 获得差值方程
  private static getInterpolationFunction(particlesTransformType: number): (value: number, min: number, max: number) => number {
    switch (particlesTransformType) {
      case Emitter.TRANSFORM_LINEAR: return (value: number, min: number, max: number) => (value - min) / (max - min);
      case Emitter.TRANSFORM_SMOOTH: return THREE.Math.smoothstep;
      case Emitter.TRANSFORM_SMOOTHER: return THREE.Math.smootherstep;
      default: return () => 0;
    }
  }
}

export default Emitter;
