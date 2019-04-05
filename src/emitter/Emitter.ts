import * as THREE from 'three';
import { Particle, ParticleInterface } from '../particle/Particle';
import Physical from '../physical/Physical';
import Points from '../particle/Points';
import Line from '../particle/Line';
import Lut from '../util/Lut';
import Util from '../util/Util';
import Effect from '../effect/Effect';

class Emitter extends THREE.Object3D {
  static readonly MODE_DURATIOIN: number = 0; // 持续发射
  static readonly MODE_EXPLOSION: number = 1; // 爆炸失发射
  emission: number; // 每秒发射的粒子数
  emitting: boolean; // 是否发射粒子中
  clock: THREE.Clock; // 生命时钟
  anchor: THREE.Vector3; // 粒子发射原点
  particles: ParticleInterface[]; // 发射粒子样板
  physicals: Physical[]; // 物理场
  effects: Effect[]; // 特效场
  isVerticalToDirection: boolean; // 粒子朝向是否垂直于运动方向
  mode: number; // 发射模式
  particlesPositionRandom: null | THREE.Vector3; // 粒子位置随机数
  particlesOpacityRandom: number; // 粒子透明度随机数
  particlesOpacityKey: number[]; // 一个生命周期内，粒子透明度关键帧百分比
  particlesOpacityValue: number[]; // 一个生命周期内，粒子透明度关键帧透明度值
  particlesColorRandom: number[]; // 粒子颜色随机数
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
    isVerticalToDirection = false,
    mode = Emitter.MODE_DURATIOIN,
    anchor = new THREE.Vector3(0, 0, 0),
    particlesPositionRandom = null,
    particlesOpacityRandom = 0,
    particlesOpacityKey = [],
    particlesOpacityValue = [],
    particlesColorRandom = [0, 0, 0],
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
    this.emitting = true;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.particles = [];
    this.physicals = [];
    this.effects = [];
    this.anchor = anchor;
    this.particlesPositionRandom = particlesPositionRandom;
    this.particlesOpacityRandom = particlesOpacityRandom;
    this.particlesOpacityKey = particlesOpacityKey;
    this.particlesOpacityValue = particlesOpacityValue;
    this.particlesColorRandom = particlesColorRandom;
    this.particlesColorKey = particlesColorKey;
    this.particlesColorValue = particlesColorValue;
    this.particlesRotationRandom = particlesRotationRandom;
    this.particlesRotationKey = particlesRotationKey;
    this.particlesRotationValue = particlesRotationValue;
    this.particlesScaleRandom = particlesScaleRandom;
    this.particlesScaleKey = particlesScaleKey;
    this.particlesScaleValue = particlesScaleValue;
    this.particlesTransformType = Particle.TRANSFORM_LINEAR;
    this.type = 'Emitter';
    this.gap = 0;
  }
  // 新增样板粒子
  addParticle(particle: ParticleInterface): void {
    this.particles.push(particle);
  }
  // 新增物理场
  addPhysical(physical: Physical): void {
    this.physicals.push(physical);
  }
  // 新增特效场
  addEffect(effect: Effect): void {
    this.effects.push(effect);
  }
  // 开始发射粒子，默认为开启
  start(): void {
    this.emitting = true;
  }
  // 暂停发射粒子
  stop(): void {
    this.emitting = false;
  }
  // 生成粒子
  generate(): ParticleInterface[] {
    // 发射器进行打点
    let delta: number = this.clock.getDelta(); // 距离上一次发射粒子过去的时间差
    let deltaEmission: number = 0; // 该时间差需要发射多少粒子
    const particlesNumber = this.particles.length;
    const generatedParticles: ParticleInterface[] = [];

    // 当发射器处于发射状态，且粒子样本数量大于 0 时，才会进行粒子创建
    if (this.emitting && particlesNumber > 0) {
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
    for (let i: number = this.children.length - 1; i >= 0; i--) {
      const particle: ParticleInterface = this.children[i] as ParticleInterface;
      if (!particle.emitting) continue;
      // 粒子从出生到现在所经过的时间（单位：秒）
      const elapsedTime: number = particle.clock.elapsedTime;
      // 获得粒子距离上次更新的时间差
      const elapsedTimePercentage: number = elapsedTime % particle.life / particle.life;
      // 获得插值函数
      const interpolationFunction: (x: number, y: number, t: number) => number = Lut.getInterpolationFunction(this.particlesTransformType);

      // 设置粒子属性随机值
      // 粒子透明度
      for (let j: number = 0; j < this.particlesOpacityKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
          particle.material.opacity = interpolationFunction(
            this.particlesOpacityValue[j],
            this.particlesOpacityValue[j + 1],
            elapsedTimePercentage
          ) + THREE.Math.randFloatSpread(this.particlesOpacityRandom);
          break;
        }
      }
      
      // 粒子颜色
      for (let j: number = 0; j < this.particlesColorKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
          const preColor: THREE.Color = this.particlesColorValue[j];
          const nextColor: THREE.Color = this.particlesColorValue[j + 1];
          particle.material.color = new THREE.Color(
            interpolationFunction(preColor.r, nextColor.r, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[0]),
            interpolationFunction(preColor.g, nextColor.g, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[1]),
            interpolationFunction(preColor.b, nextColor.b, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[2]),
          )
          break;
        }
      }
      
      particle.material.needsUpdate = true;

      // 粒子位置
      this.particlesPositionRandom && particle.position.add(new THREE.Vector3(
        THREE.Math.randFloatSpread(this.particlesPositionRandom.x),
        THREE.Math.randFloatSpread(this.particlesPositionRandom.y),
        THREE.Math.randFloatSpread(this.particlesPositionRandom.z),
      ));

      // 粒子旋转
      for (let j: number = 0; j < this.particlesRotationKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesRotationKey[j] && elapsedTimePercentage < this.particlesRotationKey[j + 1]) {
          const preRotation: THREE.Vector3 = this.particlesRotationValue[j];
          const nextRotation: THREE.Vector3 = this.particlesRotationValue[j + 1];
          particle.rotateX(interpolationFunction(preRotation.x, nextRotation.x, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.x));
          particle.rotateY(interpolationFunction(preRotation.y, nextRotation.y, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.y));
          particle.rotateZ(interpolationFunction(preRotation.z, nextRotation.z, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.z));
          break;
        }
      }

      // 粒子缩放调整
      for (let j: number = 0; j < this.particlesScaleKey.length - 1; j++) {
        if (elapsedTimePercentage >= this.particlesScaleKey[j] && elapsedTimePercentage < this.particlesScaleKey[j + 1]) {
          const preScale: THREE.Vector3 = this.particlesScaleValue[j];
          const nextScale: THREE.Vector3 = this.particlesScaleValue[j + 1];
          // 缩放值不应该为 0 ,否则 three 无法计算 Matrix3 的逆，控制台报警告
          // https://github.com/aframevr/aframe-inspector/issues/524
          particle.scale.set(
            (interpolationFunction(preScale.x, nextScale.x, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.x)) || 0.00001,
            (interpolationFunction(preScale.y, nextScale.y, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.y)) || 0.00001,
            (interpolationFunction(preScale.z, nextScale.z, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.z)) || 0.00001
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
              const afterimageParticle: Line = particle.children[j] as Line;
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

}

export default Emitter;
