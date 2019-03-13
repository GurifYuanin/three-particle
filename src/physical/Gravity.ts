import * as THREE from 'three';
import Physical from './Physical';
import { ParticleInterface } from '../particle/Particle';

class Gravity extends Physical {
  direction: THREE.Vector3; // 重力方向
  gravity: number; // 重力系数
  floor: null | THREE.Plane; // 地面
  bounce: number; // 地面弹力
  firction: number; // 地面摩擦力
  constructor({
    direction = new THREE.Vector3(0, -1, 0),
    gravity = 9.8,
    floor = null,
    ...options
  } = {}) {
    super(options);
    this.direction = direction; // 重力默认为 y 轴负方向
    this.floor = floor;
    this.gravity = gravity;
  }
  effect(particle: ParticleInterface) {
    super.effect(particle);
    const elapsedTime: number = particle.clock.elapsedTime
    particle.direction.add(this.direction.clone().multiplyScalar(this.gravity * elapsedTime));
  }
}

export default Gravity;