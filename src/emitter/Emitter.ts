import * as THREE from 'three';
import Particle from '../particle/Particle';
import Physical from '../physical/Physical';
import Lut from '../util/lut';
import Util from '../util/util';

class Emitter extends THREE.Object3D {
  emission: number; // 每秒发射的粒子数
  emitting: boolean; // 是否发射粒子中
  clock: THREE.Clock; // 生命时钟
  anchor: THREE.Vector3; // 粒子发射原点
  particles: Particle[]; // 发射粒子样板
  physicals: Physical[]; // 物理场
  particlesPositionRandom: THREE.Vector3; // 粒子位置随机数
  particlesOpacityRandom: number; // 粒子透明度随机数
  particlesOpacityKey: number[]; // 一个生命周期内，粒子透明度关键帧百分比
  particlesOpacityValue: number[]; // 一个生命周期内，粒子透明度关键帧透明度值
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

  constructor({
    emission = 100,
    anchor = new THREE.Vector3(0, 0, 0),
    particlesPositionRandom = new THREE.Vector3(0, 0, 0),
    particlesOpacityRandom = 0,
    particlesOpacityKey = [],
    particlesOpacityValue = [],
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
    this.emitting = true;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.particles = [];
    this.physicals = [];
    this.anchor = anchor;
    this.particlesPositionRandom = particlesPositionRandom;
    this.particlesOpacityRandom = particlesOpacityRandom;
    this.particlesOpacityKey = particlesOpacityKey;
    this.particlesOpacityValue = particlesOpacityValue;
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
  }
  // 新增样板粒子
  addParticle(particle: Particle | Particle[]) {
    if (!(particle instanceof Particle)) {
      throw new Error('参数错误');
    }
    if (Array.isArray(particle)) {
      for (const par of particle) {
        this.addParticle(par);
      }
    } else {
      this.particles.push(particle);
    }
  }
  // 新增物理场
  addPhysical(physical: Physical) {
    this.physicals.push(physical);
  }
  // 开始发射粒子，默认为开启
  start() {
    this.emitting = true;
  }
  // 暂停发射粒子
  stop() {
    this.emitting = false;
  }
  // 生成粒子
  generate() {
    const delta: number = this.clock.getDelta();
    const deltaEmission: number = Math.round(delta * this.emission);
    if (this.emitting) {
      // 新增粒子
      for (let i: number = 0; i < deltaEmission; i++) {
        const maxIndex: number = this.particles.length - 1;
        const randomIndex: number = THREE.Math.randInt(0, maxIndex);
        const randomParticle: Particle = this.particles[randomIndex].clone();
        randomParticle.position.set(this.anchor.x, this.anchor.y, this.anchor.z);
        this.add(randomParticle);
      }
    }
  }
  // 更新粒子
  update() {
    for (let i = this.children.length; i >= 0; i--) {
      const particle: THREE.Object3D = this.children[i];
      if (particle instanceof Particle) {
        const elapsedTimePercentage: number = particle.clock.elapsedTime % particle.life / particle.life;
        const interpolationFunction = Lut.getInterpolationFunction(this.particlesTransformType);
        // 粒子透明度
        for (let j: number = 0; j < this.particlesOpacityKey.length - 1; j++) {
          if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
            Util.fill(particle.material,
              interpolationFunction(
                this.particlesOpacityValue[j],
                this.particlesOpacityValue[j + 1],
                elapsedTimePercentage
              ) + THREE.Math.randFloatSpread(this.particlesOpacityRandom),
              'opacity');
            break;
          }
        }
        // 粒子颜色
        for (let j: number = 0; j < this.particlesColorKey.length - 1; j++) {
          if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
            const preColor: THREE.Color = this.particlesColorValue[j];
            const nextColor: THREE.Color = this.particlesColorValue[j + 1];
            Util.fill(particle.material, new THREE.Color(
              interpolationFunction(preColor.r, nextColor.r, elapsedTimePercentage),
              interpolationFunction(preColor.g, nextColor.g, elapsedTimePercentage),
              interpolationFunction(preColor.b, nextColor.b, elapsedTimePercentage),
            ), 'color');
            break;
          }
        }
        Util.fill(particle.material, true, 'needsUpdate');
        // 粒子位置
        particle.position.add(new THREE.Vector3(
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
        // 物理场影响
        for (let j: number = 0; j < this.physicals.length; j++) {
          this.physicals[j].effect(particle);
        }
      }
    }
  }
  clear() {
    // 清除生命周期已经结束的粒子
    for (let i = this.children.length - 1; i >= 0; i--) {
      const particle = this.children[i];
      if (particle instanceof Particle && particle.clock.getElapsedTime() > particle.life) {
        // 这里调用了 getElapsedTime() ，将进行一次时间的打点
        // 后续直接使用 elapsedTime 而不需要再次调用该方法
        this.remove(particle);
      }
    }
  }
}

export default Emitter;