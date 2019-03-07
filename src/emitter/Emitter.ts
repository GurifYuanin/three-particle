import Particle from '../particle/Particle';
import Physical from '../physical/Physical';
import * as THREE from 'three';
import { getInterpolationFunction } from '../util/lut';

class Emitter extends THREE.Object3D {
  emission: number; // 每秒发射的粒子数
  emitting: boolean; // 是否循环生成粒子
  clock: THREE.Clock; // 生命时钟
  particles: Particle[]; // 发射粒子
  physicals: Physical[]; // 物理场
  particlesOpacityKey: number[];
  particlesOpacityValue: number[];
  particlesScaleKey: number[];
  particlesScaleValue: THREE.Vector3[];
  particlesTransformType: number;
  type: string;

  constructor({
    emission = 100,
    particlesOpacityKey = [0, .5, 1],
    particlesOpacityValue = [0, 1, 0],
    particlesScaleKey = [0, .5, 1],
    particlesScaleValue = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 0, 0)]
  }) {
    super();
    this.emission = emission;
    this.emitting = true;
    this.clock = new THREE.Clock();
    this.clock.start();
    this.particles = [];
    this.physicals = [];
    this.particlesOpacityKey = particlesOpacityKey;
    this.particlesOpacityValue = particlesOpacityValue;
    this.particlesScaleKey = particlesScaleKey;
    this.particlesScaleValue = particlesScaleValue;
    this.particlesTransformType = Particle.TRANSFORM_LINEAR;
    this.type = 'Emitter';
  }
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
  addPhysical(physical: Physical) {
    this.physicals.push(physical);
  }
  start() {
    this.emitting = true;
  }
  stop() {
    this.emitting = false;
  }
  generate() {
    const delta: number = this.clock.getDelta();
    const deltaEmission: number = Math.round(delta * this.emission);
    if (this.emitting) {
      // 新增粒子
      for (let i: number = 0; i < deltaEmission; i++) {
        const maxIndex: number = this.particles.length - 1;
        const randomIndex: number = THREE.Math.randInt(0, maxIndex);
        const randomParticle: Particle = this.particles[randomIndex].clone();
        const initOpacity: number = this.particlesOpacityValue[0];
        const initScale: THREE.Vector3 = this.particlesScaleValue[0];
        if (Array.isArray(randomParticle.material)) {
          for (const material of randomParticle.material) {
            material.opacity = initOpacity;
          }
        } else {
          randomParticle.material.opacity = initOpacity;
        }
        randomParticle.scale.set(initScale.x, initScale.y, initScale.z);
        this.add(randomParticle);
      }
    }
  }
  update() {
    for (let i = this.children.length; i >= 0; i--) {
      const particle: THREE.Object3D = this.children[i];
      if (particle instanceof Particle) {
        const elapsedTimePercentage: number = particle.clock.getElapsedTime() % particle.life / particle.life;
        const interpolationFunction = getInterpolationFunction(this.particlesTransformType);
        for (let j: number = 0; j < this.particlesOpacityKey.length - 1; j++) {
          if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
            (particle.material as THREE.Material).opacity = interpolationFunction(0, 1, elapsedTimePercentage);
          }
        }
        for (let j: number = 0; j < this.particlesScaleKey.length - 1; j++) {
          if (elapsedTimePercentage >= this.particlesScaleKey[j] && elapsedTimePercentage < this.particlesScaleKey[j + 1]) {
            const preScale: THREE.Vector3 = this.particlesScaleValue[j];
            const nextScale: THREE.Vector3 = this.particlesScaleValue[j + 1];
            const x1 = preScale.x,
              y1 = preScale.y,
              z1 = preScale.z,
              x2 = nextScale.x,
              y2 = nextScale.y,
              z2 = nextScale.z;
            particle.scale.set(
              interpolationFunction(x1, x2, elapsedTimePercentage),
              interpolationFunction(y1, y2, elapsedTimePercentage),
              interpolationFunction(z1, z2, elapsedTimePercentage)
            );
          }
        }
      }
    }
  }
}

export default Emitter;
