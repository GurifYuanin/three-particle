import * as THREE from 'three';
import Physical from './Physical';
import { ParticleInterface } from '../particle/Particle';

class Gravity extends Physical {
  direction: THREE.Vector3; // 重力方向
  gravity: number; // 重力系数
  floor: null | THREE.Plane; // 地面
  bounce: number; // 地面弹跳系数 [0, 1]
  firction: number; // 地面摩擦力系数
  constructor({
    direction = new THREE.Vector3(0, -1, 0),
    gravity = 9.8,
    floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    bounce = .5,
    firction = 1,
    ...options
  } = {}) {
    super(options);
    this.direction = direction.normalize(); // 重力默认为 y 轴负方向
    this.floor = floor;
    this.bounce = bounce;
    this.firction = firction;
    this.gravity = gravity;
  }
  effect(particle: ParticleInterface): void {
    super.effect(particle);
    const velocity = particle.direction.add(
      this.direction
        .clone()
        .multiplyScalar(this.gravity * particle.clock.elapsedTime)
    ).length();
    particle.direction.normalize();
    particle.velocity = velocity;

    // 存在地面
    // 1、与地面进行碰撞后反弹
    // 2、若已经无法弹起则产生摩擦
    if (this.floor) {
      const ray = new THREE.Ray(particle.position, particle.direction);
      const intersectPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // 粒子运动与平面的交叉点
      const distance = this.floor.distanceToPoint(particle.position); // 粒子与地面的距离（地面上为正，地面下为负）
      const angle = particle.direction.angleTo(this.floor.normal); // 粒子方向与地面法线的弧度
      ray.intersectPlane(this.floor, intersectPoint);
      if (
        intersectPoint &&
        distance < 1 ||
        angle < 1.57 &&
        distance > -1
      ) {
        // 90deg = Math.PI / 2 ≈ 1.57
        if (Math.abs(angle - 1.57) < .1) {
          const directionShadowPoint: THREE.Vector3 = this.floor.coplanarPoint(intersectPoint.clone().add(particle.direction));
          particle.direction = directionShadowPoint.sub(intersectPoint).normalize();
          particle.velocity -= this.firction * particle.clock.elapsedTime;
        } else {
          // 反弹
          // https://blog.csdn.net/happy__888/article/details/1545432
          // 当法线为单位向量时，折线计算公式
          // v - 2 * (v * N) * N
          // const normal = this.floor.normal.clone();
          // const direction = particle.direction.clone();
          // particle.direction = direction.sub(normal.multiply(normal).multiply(direction).multiplyScalar(2));
          particle.direction.reflect(this.floor.normal);
          particle.velocity = this.bounce * particle.velocity;
        }
      }

    }
  }
}

export default Gravity;